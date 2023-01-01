import classnames from "classnames";
import Link from "next/link";
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
            랄라는 다 함께 행복한 유아의 성장을 돕습니다. <br />
            아래의 다양한 서비스를 이용해보세요.
          </p>

          <ul className="rg_list">
            <li className="rg_item">
              <p className="rg_info_text">가입 정보를 수정할 수 있어요.</p>
              <Link href="/member/user" passHref>
                <a className="rg_link">개인 정보</a>
              </Link>
            </li>
            <li className="rg_item">
              <p className="rg_info_text">필요한 계정을 추가해보세요.</p>
              <Link href="/member/append" passHref>
                <a className="rg_link">계정 추가</a>
              </Link>
            </li>
            <li className="rg_item">
              <p className="rg_info_text">원 정보를 수정할 수 있어요</p>
              <Link href="/owner_setting/school" passHref>
                <a className="rg_link">원 정보</a>
              </Link>
            </li>
            <li className="rg_item">
              <p className="rg_info_text">반을 만들고 관리해보세요.</p>
              <Link href="/owner_setting/class" passHref>
                <a className="rg_link">반 관리</a>
              </Link>
            </li>
            <li className="rg_item">
              <p className="rg_info_text">선생님과 원아를 초대해보세요.</p>
              <Link href="/owner_setting/invitation/admin" passHref>
                <a className="rg_link">초대 및 승인</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
