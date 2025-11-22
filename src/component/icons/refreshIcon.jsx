import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import "./_index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * GPS 버튼 컴포넌트
 */
const RefreshIcon = () => {
  return (
    <div
      className="iconsStyleClass"
      style={{
        backgroundColor: "var(--white)",
      }}>
      <div>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </div>
    </div>
  );
};
export default RefreshIcon;
