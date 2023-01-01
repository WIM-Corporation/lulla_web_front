const AdminRow = ({ role, createdAt, phone, onCancel, onRetry }) => {
  return (
    <div className="adm_row">
      <div className="adm_td">
        <p className="tbl_center">{role}</p>
      </div>
      <div className="adm_td" style={{ padding: 11 }}>
        <p>{createdAt}</p>
      </div>
      <div className="adm_td">
        <p>{phone}</p>
      </div>
      <div className="adm_td">
        <div className="btn_box">
          <a className="invite_X invite_request_btn" onClick={onCancel}>
            초대 취소
          </a>
          <a className="invite_R invite_request_btn" onClick={onRetry}>
            재초대
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminRow;
