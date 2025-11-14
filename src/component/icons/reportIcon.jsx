import reportIcon from "../../assets/icons/report.png";
import "./_index.css";

const ReportIcon = () => {
  return (
    <div
      className="iconsStyleClass flexCenter"
      style={{
        backgroundColor: "var(--primary-300)",
      }}>
      <div
        style={{
          backgroundImage: `url(${reportIcon})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default ReportIcon;
