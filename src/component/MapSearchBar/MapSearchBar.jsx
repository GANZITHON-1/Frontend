import searchIcon from "../../assets/icons/search.svg";
import "./MapSearchBar.css";
import backmark from "../../assets/icons/back.svg";
import { useNavigate } from "react-router-dom";

export default function MapPageSearchBar({
  place,
  setSelectData,
  selectData,
  mode = "map",
}) {
  const nav = useNavigate();

  return (
    <div className="mapPage-search-bar">
      {Object.keys(selectData).length !== 0 && (
        <div
          className="mapPage-xmark-box"
          onClick={() => {
            setSelectData({});
          }}
        >
          <img src={backmark} alt="선택 취소" />
        </div>
      )}

      <div
        className="mapPage-search-box"
        onClick={() => {
          if (mode === "map") {
            nav("/map-search");
          } else {
            nav("/report-search");
          }
        }}
      >
        <img src={searchIcon} className="mapPage-search-icon" />
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="mapPage-search-input"
          value={place}
          disabled
          readOnly
        />
      </div>
    </div>
  );
}
