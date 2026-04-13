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
            <button onClick={onBuild}>Bygg tre</button>

            <button onClick={onDownloadImage}>
                Last ned bilde
            </button>

            <button onClick={onDownloadText}>
                Last ned tekst
            </button>

            <input type="file" onChange={onUploadFile}/>
        </div>
    );
}

export default Menu;