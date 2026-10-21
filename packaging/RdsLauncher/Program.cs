
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Windows.Forms;

namespace RdsLauncher;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new LauncherForm());
    }
}

internal sealed class LauncherForm : Form
{
    private const string Address = "http://127.0.0.1:8080";

    private readonly Label statusLabel;
    private readonly Button stopButton;
    private readonly CancellationTokenSource cancellation = new();

    private Process? backend;

    public LauncherForm()
    {
        Text = "RDS Visualization";
        Width = 420;
        Height = 170;
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        statusLabel = new Label
        {
            Text = "Starter RDS Visualization...",
            Dock = DockStyle.Fill,
            TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        };

        stopButton = new Button
        {
            Text = "Avslutt program",
            Dock = DockStyle.Bottom,
            Height = 42
        };

        stopButton.Click += (_, _) => Close();

        Controls.Add(statusLabel);
        Controls.Add(stopButton);

        Shown += async (_, _) => await StartBackendAsync();
        FormClosing += (_, _) => StopBackend();
    }

    private async Task StartBackendAsync()
    {
        string directory = AppContext.BaseDirectory;
        string javaPath = Path.Combine(
            directory, "runtime", "bin", "java.exe");
        string jarPath = Path.Combine(directory, "backend.jar");
        string logDirectory = Path.Combine(directory, "logs");

        try
        {
            if (!File.Exists(javaPath))
                throw new FileNotFoundException(
                    "Fant ikke medfølgende Java.", javaPath);

            if (!File.Exists(jarPath))
                throw new FileNotFoundException(
                    "Fant ikke backend.jar.", jarPath);

            // Check that port 8080 is available.
            var listener = new TcpListener(IPAddress.Loopback, 8080);

            try
            {
                listener.Start();
            }
            catch (SocketException)
            {
                throw new InvalidOperationException(
                    "Port 8080 er allerede i bruk. " +
                    "Avslutt programmet som bruker porten.");
            }
            finally
            {
                listener.Stop();
            }

            Directory.CreateDirectory(logDirectory);

            var startInfo = new ProcessStartInfo
            {
                FileName = javaPath,
                WorkingDirectory = directory,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            startInfo.ArgumentList.Add(
                "-Dlogging.file.name=" +
                Path.Combine(logDirectory, "rds.log"));

            startInfo.ArgumentList.Add("-jar");
            startInfo.ArgumentList.Add(jarPath);
            startInfo.ArgumentList.Add("--server.address=127.0.0.1");
            startInfo.ArgumentList.Add("--server.port=8080");

            backend = Process.Start(startInfo)
                ?? throw new InvalidOperationException(
                    "Kunne ikke starte Java-prosessen.");

            using var client = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(2)
            };

            bool ready = false;

            for (int i = 0; i < 60; i++)
            {
                cancellation.Token.ThrowIfCancellationRequested();

                if (backend.HasExited)
                {
                    throw new InvalidOperationException(
                        "Backend ble avsluttet under oppstart. " +
                        "Avslutningskode: " + backend.ExitCode);
                }

                try
                {
                    using var response = await client.GetAsync(
                        Address, cancellation.Token);

                    if (response.IsSuccessStatusCode)
                    {
                        ready = true;
                        break;
                    }
                }
                catch (HttpRequestException)
                {
                    // Server is not ready yet.
                }
                catch (TaskCanceledException)
                    when (!cancellation.IsCancellationRequested)
                {
                    // A request timed out; try again.
                }

                await Task.Delay(500, cancellation.Token);
            }

            if (!ready)
                throw new TimeoutException(
                    "Serveren svarte ikke innen oppstartstiden.");

            cancellation.Token.ThrowIfCancellationRequested();

            statusLabel.Text = "Programmet kjører i nettleseren.";

            Process.Start(new ProcessStartInfo
            {
                FileName = Address,
                UseShellExecute = true
            });
        }
        catch (OperationCanceledException)
        {
            // Normal when the user closes the launcher.
        }
        catch (Exception ex)
        {
            if (cancellation.IsCancellationRequested)
                return;

            MessageBox.Show(
                "Kunne ikke starte RDS Visualization.\n\n" +
                ex.Message + "\n\n" +
                "Eventuell serverlogg finnes i logs/rds.log.",
                "Oppstartsfeil",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);

            Close();
        }
    }

    private void StopBackend()
    {
        cancellation.Cancel();

        try
        {
            if (backend != null && !backend.HasExited)
            {
                backend.Kill(entireProcessTree: true);
                backend.WaitForExit(5000);
            }
        }
        catch (InvalidOperationException)
        {
            // Process has already exited.
        }
        catch (System.ComponentModel.Win32Exception)
        {
            // Windows could not terminate the process.
        }
        finally
        {
            backend?.Dispose();
        }
    }
}
