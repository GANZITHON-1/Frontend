import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import backIcon from "../../assets/icons/back.svg";

export default function NavigationBar({ title = null, onBack }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (typeof onBack === "function") onBack();
    else navigate(-1);
  };

  return (
    <header className="navibar">
      <button className="navibar_back" onClick={handleBack}>
        <img src={backIcon} alt="" className="navibar_back-icon" />
      </button>
      <h1 className="navibar_title">{title}</h1>
    </header>
  );
}
