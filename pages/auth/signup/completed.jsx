import Link from "next/link";
import NavHeader from "@/components/Layouts/NavHeader";
import { observer } from "mobx-react-lite";
import useStores from "@/stores/useStores";
import { useEffect } from "react";
import { useRouter } from "next/router";

const CompletedComponent = observer(() => {
  const router = useRouter();
  const { authStore } = useStores();
  const invitations = authStore.invitations;
  const roleBtnHref =
    Array.isArray(invitations) && invitations.length > 0
      ? "/member/invitation"
      : "/member/append/select";

  useEffect(() => {
    if (authStore.loading) {
      authStore.autoLoginProcess();
    }
    if (!authStore.isAuth) router.push("/");
    authStore.getInvitation();
  }, [authStore.isAuth, authStore.loading]);

  return (
    <>
      <div className="Wrap">
        <NavHeader hasLogo />
        <main className="flexCenter">
          <div className="title_box">
            <p className="title_left">
              환영합니다. <br />
              <span className="point_teal">랄라</span> 회원이 되셨습니다.
            </p>
          </div>
          <section className="sec_1">
            <li className="info_list">
              <Link href={roleBtnHref}>
                <a className="pass_btn">역할 설정하기</a>
              </Link>
            </li>
          </section>
        </main>
      </div>
      <style jsx>{`
        .title_box {
          padding-top: 0;
        }
      `}</style>
    </>
  );
});

const Completed = (props) => <CompletedComponent {...props} />;
export default Completed;
