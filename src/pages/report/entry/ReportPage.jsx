import { useState, useEffect } from "react";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportPage.css";
import uploadIcon from "../../../assets/icons/upload.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import { useNavigate, useLocation } from "react-router-dom";

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation(); // /report-search 에서 반환된 주소 데이터 받기
  const autoAddress = location.state?.address || "";

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // 실제 파일 업로드용
  const [content, setContent] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState({});

  // /report-search에서 선택된 주소값 받아오기
  useEffect(() => {
    if (location.state && location.state.selectedAddress) {
      const { roadAddress, lotAddress, lat, lng } =
        location.state.selectedAddress;
      setAddress(roadAddress || lotAddress || "");
      setLat(lat);
      setLng(lng);
    }
  }, [location]);

  useEffect(() => {
    if (autoAddress) setAddress(autoAddress);
  }, [autoAddress]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // 미리보기
      setPhotoFile(file);
    }
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

  // 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = "제목을 입력해 주세요.";
    if (!address.trim() || !detail.trim())
      newErrors.address = "위치를 선택해 주세요.";
    if (!photo) newErrors.photo = "사진을 업로드 해주세요.";
    if (content.trim().length < 30) newErrors.content = "설명을 입력해 주세요.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("userId", 1); // 실제 로그인 사용자 id로 대체
      formData.append("title", title);
      formData.append("description", content);
      formData.append("image", photoFile); // 백엔드에서 imageUrl 생성
      formData.append("roadAddress", address);
      formData.append("lotAddress", detail);
      formData.append("locationLat", lat || 0);
      formData.append("locationLng", lng || 0);
      formData.append("sourceType", "USER");

      const response = await fetch("/report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("제보 등록 실패");
      alert("제보가 등록되었습니다.");
      navigate("/report-list");
    } catch (err) {
      console.error(err);
      alert("제보 등록 중 오류가 발생했습니다.");
    }
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
            onClick={() => navigate("/report-search")}
            onChange={(e) => setAddress(e.target.value)}
            readOnly
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
