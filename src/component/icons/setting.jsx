import setting from "../../assets/icons/setting.png";
import "./_index.css";

const SettingIcon = () => {
  return (
    <div
      className="iconsStyleClass"
      style={{
        backgroundColor: "var(--white)",
      }}>
      <div
        style={{
          backgroundImage: `url(${setting})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default SettingIcon;
