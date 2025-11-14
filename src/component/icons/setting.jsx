import { useNavigate } from "react-router-dom";
import setting from "../../assets/icons/setting.png";
import "./_index.css";

const SettingIcon = () => {
  const navigate = useNavigate();

  return (
    <div
      className="iconsStyleClass"
      style={{
        backgroundColor: "var(--white)",
        cursor: "pointer",
      }}
      onClick={() => navigate("/mypage")}
    >
      <div
        style={{
          backgroundImage: `url(${setting})`,
        }}
      >
        {/* icon */}
      </div>
    </div>
  );
};

export default SettingIcon;
