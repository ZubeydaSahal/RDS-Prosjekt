import FilterDropdown from "./FilterDropdown";

function Menu({
  activeAspect,
  setActiveAspect,
  activeRelation,
  setActiveRelation,
  onBuild,
  onDownloadImage,
  onDownloadText,
  onUploadFile
}) {
    return (
        <div className="menu">
            {/* FILTER */}
            <FilterDropdown
                activeAspect={activeAspect}
                setActiveAspect={setActiveAspect}
                activeRelation={activeRelation}
                setActiveRelation={setActiveRelation}
            />

            <button onClick={onDownloadImage}>
                Last ned bilde
            </button>

            <button onClick={onDownloadText}>
                Last ned tekst
            </button>

            <label className="file-button">
                Last opp fil
                <input type="file" onChange={onUploadFile}/>
            </label>
            <button className="primary" onClick={onBuild}>Bygg tre</button>
        </div>
    );
}

export default Menu;