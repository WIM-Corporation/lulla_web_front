import { useRouter } from "next/router";
import classnames from "classnames";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const ObserverComponent = observer(
  ({ isOpen, handleOpen, handleClickLogout }) => {
    const router = useRouter();
    const { authStore, globalStore } = useStores();
    const loading = authStore.isMemberLoaded;

    const handleClickSettingMember = (e, href, cb) => {
      e.preventDefault();
      if (authStore.curMember && authStore.memberList.length > 0 && href)
        return router.push(href);

      if (
        authStore.curMember &&
        authStore.memberList.length > 0 &&
        cb &&
        typeof cb === "function"
      ) {
        cb();
        return;
      }

      globalStore.setToastActive("역할설정 이후 사용 가능합니다.");
      return "";
    };

    if (!authStore.isMemberLoaded) {
      authStore.initMemberList();
    }

    return (
      <div className="profile_dropdown" hidden={!isOpen}>
        <div className="profile_header">
          <div className="profile_hd_box">
            <img
              src={
                authStore?.curMember && authStore?.curMember?.member_image
                  ? authStore.curMember.member_image
                  : "/imgs/profile-m.png"
              }
              style={{
                width: 96,
                height: 96,
                overflow: "hidden",
                borderRadius: "50%",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <p className="profile_name_text">
            {!loading
              ? "loading"
              : authStore.curMember
              ? authStore.curMember.member_nickname
              : authStore.userInfo?.name}
            {/* <span className="certification"><img src="/imgs/badge-s.png"/></span> */}
          </p>
          <div className="profile_change_box">
            <Link href="" passHref>
              <a
                className="change_profile change_btn"
                onClick={(e) =>
                  handleClickSettingMember(e, null, () => {
                    globalStore.setProfileEditModalHidden(false);
                    handleOpen(false);
                  })
                }
              >
                프로필 수정
              </a>
            </Link>
            <Link href="">
              <a
                className="change_account change_btn"
                onClick={() => {
                  handleOpen(false);
                  globalStore.setProfileChangeModalHidden(false);
                }}
              >
                계정 전환
              </a>
            </Link>
          </div>
        </div>
        <ul className="profile_body">
          <li className="profile_item">
            <Link href="" passHref>
              <a
                onClick={(e) => handleClickSettingMember(e, "/member/account")}
              >
                <img src="/imgs/profile-s.png" />내 계정
              </a>
            </Link>
          </li>
          <li className="profile_item">
            <Link href="/member/user" passHref>
              <a onClick={(e) => router.push("/member/user")}>
                <img src="/imgs/lock-s.png" />
                개인 정보
              </a>
            </Link>
          </li>
          <li className="profile_item">
            <Link href="/member/invitation" passHref>
              <a>
                <img src="/imgs/mail-s.png" />
                초대관리
              </a>
            </Link>
          </li>
          <li className="profile_item">
            <Link href="/member/append" passHref>
              <a>
                <img src="/imgs/user-add-s.png" />
                계정 추가
              </a>
            </Link>
          </li>
          <li className="profile_item">
            <Link href="" passHref>
              <a>
                <img src="/imgs/bookmark-s.png" />
                책갈피
              </a>
            </Link>
          </li>
          <li className="profile_item">
            <a onClick={handleClickLogout}>
              <img src="/imgs/logout.png" />
              로그아웃
            </a>
          </li>
        </ul>
      </div>
    );
  }
);

const ProfileMenu = (props) => <ObserverComponent {...props} />;
export default ProfileMenu;
