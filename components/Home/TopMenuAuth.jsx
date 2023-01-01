import Link from "next/link";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import useStores from "@/stores/useStores";

const ContentsComponent = observer((props) => {
  const router = useRouter();
  const {authStore} = useStores();

  const handleClickLogout = (e) => {
    authStore.signOut();
    router.replace("/");
  };

  return authStore.isAuth ? (
    <div className="right-actions">
      <Link href="/notice">시작하기</Link>
      &nbsp;|&nbsp;
      <span className="cpoint" onClick={handleClickLogout}>
        로그아웃
      </span>
    </div>
  ) : (
    <div className="right-actions">
      <Link href="/auth/signin">로그인</Link>
      &nbsp;|&nbsp;
      <Link href="/auth/signup">회원가입</Link>
    </div>
  );
});

const TopMenuAuth = () => <ContentsComponent />;
export default TopMenuAuth;
