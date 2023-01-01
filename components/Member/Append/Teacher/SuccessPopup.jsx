import classnames from "classnames";
import { useRouter } from "next/router";

export default function SuccessPopup(props) {
  const router = useRouter();

  return (
    <div className={classnames({ mask: true, hide: !props.isOpen })}>
      <div className="popup_box registration_popup">
        <div className="regstration_hd">
          <div className="rg_logo_box">
            <img src="/imgs/logo.png" />
            <div
              className="popup_close"
              onClick={(e) => router.push("/notice")}
            >
              <img src="/imgs/x_btn4.png" />
            </div>
          </div>
        </div>
        <div className="regstration_body">
          <p className="rg_title">등록이 완료되었습니다.</p>
          <p className="rg_text">
            해당 원에 승인 요청이 진행 중입니다. <br />
            승인 완료 후 다양한 서비스를 이용하실 수 있습니다.
          </p>

          <ul className="rg_list">
            <li className="rg_item">
              <p className="rg_info_text">가입 정보를 수정할 수 있어요.</p>
              <a href="javascript:void(0);" className="rg_link">
                개인 정보
              </a>
            </li>
            <li className="rg_item">
              <p className="rg_info_text">필요한 계정을 추가해보세요.</p>
              <a
                href="javascript:void(0);"
                className="rg_link"
                onClick={(e) => router.push("/member/append/select")}
              >
                계정 추가
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
