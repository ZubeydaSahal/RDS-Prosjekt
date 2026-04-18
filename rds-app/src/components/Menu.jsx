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
  onBuild,
  onDownloadImage,
  onDownloadText,
  onUploadFile
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

            </div>
        </div>
    );
}

export default Menu;