export default function Loading() {
  return (
    <div className="recognize" style={{ position: "absolute", top: 0 }}>
      <div className="spin_box">
        <div className="spinner"></div>
        <p className="recognize_text">인식 중 입니다.</p>
      </div>
    </div>
  );
}
