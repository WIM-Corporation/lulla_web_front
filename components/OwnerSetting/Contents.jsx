import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const OwnerSettingComponent = observer(() => {
  const { authStore } = useStores();
  const curMember = authStore?.curMember;

  return (
    <>
      <main className="admin_box">
        <div className="adm_box">
          <div className="adm_header4">
            <p className="adm_title">원 관리</p>
          </div>
          <div className="won_manageBox">
            {curMember?.grade === 1 && (
              <div className="manage_item">
                <div className="manage_textBox">
                  <p>원</p>
                  <p>
                    원의 정보를 호가인 또는 변경할 수 있고 원장 권한을 위임할 수
                    있습니다.
                  </p>
                </div>
                <div className="manage_btnBox">
                  <Link href="/owner_setting/school" passHref>
                    <a className="nowBtn">바로 가기</a>
                  </Link>
                </div>
              </div>
            )}

            <div className="manage_item">
              <div className="manage_textBox">
                <p>반</p>
                <p>반의 신규 등록과 정보 수정이 가능합니다. </p>
              </div>
              <div className="manage_btnBox">
                <Link href="/owner_setting/class" passHref>
                  <a href="" className="nowBtn">
                    바로 가기
                  </a>
                </Link>
              </div>
            </div>
            <div className="manage_item">
              <div className="manage_textBox">
                <p>구성원</p>
                <p>
                  원에 소속된 관리자, 선생님, 원아 정보를 확인하고 관리할 수
                  있습니다.{" "}
                </p>
              </div>
              <div className="manage_btnBox">
                <Link href="" passHref>
                  <a className="nowBtn">바로 가기</a>
                </Link>
              </div>
            </div>
            <div className="manage_item">
              <div className="manage_textBox">
                <p>초대 및 승인</p>
                <p>
                  원에 소속된 관리자, 선생님, 원아를 초대하고 승인할 수
                  있습니다.
                </p>
              </div>
              <div className="manage_btnBox">
                <Link href="/owner_setting/invitation/admin" passHref>
                  <a className="nowBtn">바로 가기</a>
                </Link>
              </div>
            </div>
            {curMember?.grade === 1 && (
              <div className="manage_item">
                <div className="manage_textBox">
                  <p>메뉴관리</p>
                  <p>원에서 사용할 메뉴를 설정할 수 있습니다.</p>
                </div>
                <div className="manage_btnBox">
                  <Link href="/owner_setting/class" passHref>
                    <a className="nowBtn">바로 가기</a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <style jsx>{`
        main {
          min-height: 100%;
          padding: 0px 8px 36px;
        }
      `}</style>
    </>
  );
});

const OwnerSetting = (props) => <OwnerSettingComponent {...props} />;
export default OwnerSetting;
