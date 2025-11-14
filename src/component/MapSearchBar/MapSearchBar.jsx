import searchIcon from "../../assets/icons/search.svg";
import micIcon from "../../assets/icons/mic.svg";
import "./MapSearchBar.css";
import backmark from "../../assets/icons/back.svg";
import { useNavigate } from "react-router-dom";

export default function MapPageSearchBar({ place, setSelectData, selectData }) {
  // nav("/report-search")
  const nav = useNavigate();

  return (
    <div className="mapPage-search-bar">
      {Object.keys(selectData).length !== 0 && (
        <div
          className="mapPage-xmark-box"
          onClick={() => {
            setSelectData({});
          }}>
          <img src={backmark} alt="선택 취소" />
        </div>
      )}
      <div
        className="mapPage-search-box"
        onClick={() => {
          nav("/report-search");
        }}>
        <img src={searchIcon} alt="검색" className="mapPage-search-icon" />
        <input type="text" placeholder="검색어를 입력하세요" className="mapPage-search-input" value={place} disabled readOnly />
        <img src={micIcon} alt="음성검색" className="mapPage-mic-icon" />
      </div>
    </div>
  );
}
