import { useState, useEffect } from "react";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportPage.css";
import uploadIcon from "../../../assets/icons/upload.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../api/index"; // 공용 axios 인스턴스

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const autoAddress = location.state?.address || "";

  const [title, setTitle] = useState(location.state?.prevTitle || "");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [content, setContent] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState({});

  // /report-search에서 선택된 주소값 받아오기
  useEffect(() => {
    if (location.state?.selectedAddress) {
      const { roadAddress, lotAddress, lat, lng } = location.state.selectedAddress;

      setAddress(roadAddress || lotAddress || "");
      setLat(lat);
      setLng(lng);
    }
  }, [location.state?.selectedAddress]);

  useEffect(() => {
    if (autoAddress) setAddress(autoAddress);
  }, [autoAddress]);

  // 사진 업로드
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  // 입력 감지 → 버튼 활성화
  useEffect(() => {
    const filled = title.trim() && address.trim() && detail.trim() && content.trim().length >= 30 && photo;
    setIsActive(!!filled);
  }, [title, address, detail, content, photo]);

  /**
   * 제보 제출
   * fetch → api.post (axios)로 변경
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "제목을 입력해 주세요.";
    if (!address.trim() || !detail.trim()) newErrors.address = "위치를 선택해 주세요.";
    if (!photo) newErrors.photo = "사진을 업로드 해주세요.";
    if (content.trim().length < 30) newErrors.content = "설명을 입력해 주세요.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", content);
      formData.append("image", photoFile);
      formData.append("roadAddress", address);
      formData.append("lotAddress", detail);
      formData.append("latitude", lat);
      formData.append("longitude", lng);
      formData.append("sourceType", "USER");

      // 1) 이미지 업로드
      let imageUrl = "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadRes = await api.post("/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadRes.data.success) {
          throw new Error("이미지 업로드 실패");
        }

        // 백엔드 명세상 data가 URL 문자열
        imageUrl = uploadRes.data.data;
      }

      // 2) 제보 생성(JSON)
      const response = await api.post("/report", {
        title,
        description: content,
        imageUrl,
        roadAddress: address,
        lotAddress: detail,
        latitude: lat,
        longitude: lng,
        sourceType: "USER",
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "제보 등록 실패");
      }

      // 제보 성공 → MapPage로 이동
      navigate("/map", {
        state: { reportSuccess: true },
      });
    } catch (error) {
      console.error(error);
      alert("제보 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <NavigationBar title="제보하기" />

      <div className="report-container report-page">
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
            onClick={() =>
              navigate("/report-search", {
                state: {
                  prevTitle: title,
                  mode: "report",
                },
              })
            }
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
          <label htmlFor="photo-upload" className={`upload-box ${errors.photo ? "error" : ""}`}>
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
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden-input" />
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
        <button className={`submit-btn ${isActive ? "active" : ""}`} onClick={handleSubmit}>
          제보하기
        </button>
      </div>
    </div>
  );
}
