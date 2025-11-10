import { useState, useEffect } from "react";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportPage.css";
import uploadIcon from "../../../assets/icons/upload.svg";
import warningIcon from "../../../assets/icons/warning.svg";

export default function ReportPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  // 모든 항목 입력 여부 확인
  useEffect(() => {
    const filled =
      title.trim() &&
      address.trim() &&
      detail.trim() &&
      content.trim().length >= 30 &&
      photo;
    setIsActive(!!filled);
  }, [title, address, detail, content, photo]);

  // 유효성 검사
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = "제목을 입력해 주세요.";
    if (!address.trim() || !detail.trim())
      newErrors.address = "위치를 선택해 주세요.";
    if (!photo) newErrors.photo = "사진을 업로드 해주세요.";
    if (content.trim().length < 30) newErrors.content = "설명을 입력해 주세요.";

    setErrors(newErrors);
  };

  return (
    <div>
      <NavigationBar title="제보하기" />

      <div className="report-container">
        {/* 제목 */}
        <div className="form-section">
          <label className="form-label">제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요."
            className={`input-box ${errors.title ? "error" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <div className="error-msg">
              <img src={warningIcon} alt="warning" className="warning-icon" />
              <span>{errors.title}</span>
            </div>
          )}
        </div>

        {/* 위치 */}
        <div className="form-section">
          <label className="form-label">위치</label>
          <input
            type="text"
            placeholder="건물, 지번 또는 도로명 검색"
            className={`input-box ${errors.address ? "error" : ""}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="상세주소"
            className={`input-box ${errors.address ? "error" : ""}`}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
          {errors.address && (
            <div className="error-msg">
              <img src={warningIcon} alt="warning" className="warning-icon" />
              <span>{errors.address}</span>
            </div>
          )}
        </div>

        {/* 사진 업로드 */}
        <div className="form-section">
          <label className="form-label">사진</label>
          <label
            htmlFor="photo-upload"
            className={`upload-box ${errors.photo ? "error" : ""}`}
          >
            {photo ? (
              <img src={photo} alt="uploaded" className="upload-preview" />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">
                  <img src={uploadIcon} alt="upload" />
                </div>
                <p>
                  사진을 업로드해주세요.
                  <br />
                  (jpg, jpeg, png)
                </p>
              </div>
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden-input"
          />
          {errors.photo && (
            <div className="error-msg">
              <img src={warningIcon} alt="warning" className="warning-icon" />
              <span>{errors.photo}</span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="form-section">
          <textarea
            placeholder="최소 30글자 이상 입력해 주세요."
            className={`textarea-box ${errors.content ? "error" : ""}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content && (
            <div className="error-msg">
              <img src={warningIcon} alt="warning" className="warning-icon" />
              <span>{errors.content}</span>
            </div>
          )}
        </div>
        {/* 버튼 */}
        <button
          className={`submit-btn ${isActive ? "active" : ""}`}
          onClick={handleSubmit}
        >
          제보하기
        </button>
      </div>
    </div>
  );
}
