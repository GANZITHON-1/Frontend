import "../ui/ReportEditPage.css";

function ReportEditSkeleton() {
  return (
    <div className="report-container edit-page">
      {/* 제목 */}
      <div className="form-section">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-input"></div>
      </div>

      {/* 위치 */}
      <div className="form-section">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
      </div>

      {/* 사진 */}
      <div className="form-section">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-photo"></div>
      </div>

      {/* 내용 */}
      <div className="form-section">
        <div className="skeleton skeleton-textarea"></div>
      </div>

      {/* 버튼 */}
      <div className="skeleton-btn-group">
        <div className="skeleton skeleton-btn"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}

export default ReportEditSkeleton;
