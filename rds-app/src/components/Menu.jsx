import FilterDropdown from "./FilterDropdown";
import imageDownload from "../assets/image-download.svg"
import TextDownload from "../assets/file-download.svg"
import TextUpload from "../assets/upload text.svg"
function Menu({
  activeAspect,
  setActiveAspect,
  activeRelation,
  setActiveRelation,
  relationTypes = [],
  maxDepth,
  setMaxDepth,
  graphMaxDepth = 0,
  onBuild,
  onDownloadImage,
  onDownloadText,
  onUploadFile,
  onToggleFullscreen,
  isFullscreen = false,
}) {
    return (
        <div className="menu">
            <div className="left">

            </div>

            <div className="center">
                <label className="file-button" title="Upload text">
                    <img src={TextUpload} alt="Upload text" height={24} width={24}/>
                    <span>Upload text</span>
                    <input type="file" onChange={onUploadFile}/>
                </label>
                <FilterDropdown
                    activeAspect={activeAspect}
                    setActiveAspect={setActiveAspect}
                    activeRelation={activeRelation}
                    setActiveRelation={setActiveRelation}
                    relationTypes={relationTypes}
                    maxDepth={maxDepth}
                    setMaxDepth={setMaxDepth}
                    graphMaxDepth={graphMaxDepth}
                />



                <button className="primary" onClick={onBuild}>Bygg tre</button>

                <button onClick={onDownloadText} title="Download Text">
                    <img src={TextDownload} alt="Download Text" height={24} width={24}/>
                    <span>Download Text</span>
                </button>

                <button onClick={onDownloadImage} title="Download Graph">
                    <img src={imageDownload} alt="Download Graph" height={24} width={24}/>
                    <span>Download Graph</span>
                </button>
            </div>
            <div className="right">
                <button className="fullscreen-btn" onClick={onToggleFullscreen} title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}>
                    {isFullscreen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 14 10 14 10 20"/>
                            <polyline points="20 10 14 10 14 4"/>
                            <line x1="10" y1="14" x2="3" y2="21"/>
                            <line x1="21" y1="3" x2="14" y2="10"/>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"/>
                            <polyline points="9 21 3 21 3 15"/>
                            <line x1="21" y1="3" x2="14" y2="10"/>
                            <line x1="3" y1="21" x2="10" y2="14"/>
                        </svg>
                    )}
                    <span>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
                </button>
            </div>
        </div>
    );
}

export default Menu;