import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportEditPage.css";
import uploadIcon from "../../../assets/icons/upload.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import { api } from "../../../api/index"; // 연동 위해 추가했습니다
import ReportEditSkeleton from "./ReportEditSkeleton"; // 로딩 상태

export default function ReportEditPage() {
  const { reportId } = useParams(); // URL 파라미터로 reportId 받음
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState(null); // 미리보기용 (blob 또는 기존 url)
  const [photoFile, setPhotoFile] = useState(null); // 새로 업로드할 파일
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); //로딩상태 추가

  // 기존 데이터 불러오기 (axios 스타일로 수정했습니다!)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/report/${reportId}`);

        // 테스트 용으로 넣었습니다
        console.log("상세조회 응답:", res);
        console.log("상세조회 응답 data:", res.data);
        console.log("상세조회 응답 data.data:", res.data.data);

        if (res.status !== 200) throw new Error("서버 응답 오류");

        const report = res.data.data.report; // ⬅ 요거 중요!

        // 백엔드 키와 정확히 맞춰야 함
        setTitle(report.title || "");
        setAddress(report.roadAddress || "");
        setDetail(report.lotAddress || ""); // 백엔드 명세에 따라 key 확인!
        setPhoto(report.imageUrl || ""); // key는 imageUrl
        setContent(report.description || ""); // description이 content임
      } catch (err) {
        console.error("제보 불러오기 실패:", err);
        alert("제보 데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false); // 로딩
      }
    };

    fetchReport();
  }, [reportId]);

  // 사진 업로드 핸들러
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // 미리보기용
      setPhotoFile(file); // 실제 업로드할 파일
    }
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "제목을 입력해 주세요.";
    if (!address.trim() || !detail.trim())
      newErrors.address = "위치를 입력해 주세요.";
    if (!content.trim() || content.trim().length < 30)
      newErrors.content = "설명을 최소 30자 이상 입력해 주세요.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", content); // content -> description
      if (photoFile) formData.append("image", photoFile);

      // axios로 변경
      const res = await api.put(`/report/${reportId}`, formData);

      if (res.status !== 200) throw new Error("수정 실패");

      alert("제보가 수정되었습니다.");
      navigate("/mypage/reports");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("제보 수정 중 오류가 발생했습니다.");
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      // 수정 코드와 동일하게 api 인스턴스 사용
      const res = await api.delete(`/report/${reportId}`);

      if (res.status !== 200) throw new Error("삭제 실패");

      alert("제보가 삭제되었습니다.");
      navigate("/mypage/reports");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 🔥 로딩 중이면 스켈레톤 화면 렌더링
  if (loading)
    return (
      <div>
        <NavigationBar title="제보 수정" />
        <ReportEditSkeleton />
      </div>
    );

  return (
    <div>
      <NavigationBar title="제보 수정" />

      <div className="report-container edit-page">
        {/* 제목 */}
        <div className="form-section">
          <label className="form-label">제목</label>
          <input
            type="text"
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
            placeholder="건물, 지번 또는 도로명"
            className={`input-box ${errors.address ? "error" : ""}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onClick={() => navigate("/report-search")}
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

        {/* 사진 */}
        <div className="form-section">
          <label className="form-label">사진</label>
          <label htmlFor="photo-upload" className="upload-box">
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
        <div className="btn-group">
          <button className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
