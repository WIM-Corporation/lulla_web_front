import classnames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import useStores from "@/stores/useStores";

const AccountNavComponent = observer(() => {
  const router = useRouter();
  const { globalStore, authStore } = useStores();

  const handleClickSettingMember = (e, href) => {
    e.preventDefault();
    if (authStore.curMember && authStore.memberList.length > 0)
      return router.push(href);
    globalStore.setToastActive("역할설정 이후 사용 가능합니다.");
    return "";
  };

  return (
    <>
      <nav>
        <Link href="/notice" passHref>
          <a className="logo main_logo">
            <img src="/imgs/logo.png" />
          </a>
        </Link>
        <ul className="lnb_box">
          <li
            className={classnames({
              lnb_list: true,
              active: router.pathname.startsWith("/member/account"),
            })}
          >
            <Link href="" passHref>
              <a
                onClick={(e) => handleClickSettingMember(e, "/member/account")}
              >
                내 계정
              </a>
            </Link>
          </li>
          <li
            className={classnames({
              lnb_list: true,
              active: router.pathname.startsWith("/member/user"),
            })}
          >
            <Link href="/member/user" passHref>
              <a>개인 정보</a>
            </Link>
          </li>
          {authStore.curMember?.grade === 5 && (
            <li
              className={classnames({
                lnb_list: true,
                active: false,
              })}
            >
              <Link href="" passHref>
                <a onClick={(e) => e.preventDefault()}>가족 초대</a>
              </Link>
            </li>
          )}
          <li
            className={classnames({
              lnb_list: true,
              active: router.pathname.startsWith("/member/invitation"),
            })}
          >
            <Link href="/member/invitation" passHref>
              <a>초대 관리</a>
            </Link>
          </li>
          <li
            className={classnames({
              lnb_list: true,
              active: router.pathname.startsWith("/member/append"),
            })}
          >
            <Link href="/member/append" passHref>
              <a>계정 추가</a>
            </Link>
          </li>

          <li className="lnb_list">
            <Link href="" passHref>
              <a>책갈피</a>
            </Link>
          </li>
        </ul>

        <div className="sibe_copyright">
          <ul>
            <li>
              <a>소개</a>
            </li>
            <li>
              <a>공지사항</a>
            </li>
            <li>
              <a>사용가이드</a>
            </li>
          </ul>
          <ul>
            <li>
              <a>개인정보처리방침</a>
            </li>
            <li>
              <a>이용약관</a>
            </li>
          </ul>
          <p className="copyright">© 2022 lulla inc., all rights reserved.</p>
        </div>
      </nav>
      <style jsx>{`
        nav {
          max-height: 100vh;
          position: fixed;
        }
      `}</style>
    </>
  );
});

const AccountNav = (props) => <AccountNavComponent {...props} />;
export default AccountNav;
