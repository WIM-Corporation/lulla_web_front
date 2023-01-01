import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import Header from "@/components/common/Header";

export default function Signup() {
  const router = useRouter();

  return (
    <div className="Wrap">
      <Header />
      <main className="flexCenter">
        <div className="title_box">
          <p className="title">회원가입</p>
        </div>
        <section className="sec_1">
          <div className="signup_box">
            <Link href="/auth/signup/verification">
              <a className="signup_btn teal_bg">이메일로 회원가입</a>
            </Link>
          </div>
          {/* OAuth 간편 로그인은 추후 추가 개발 사항
          <div className="middle_line">
            <p className="or_text">또는</p>
          </div>

          <ul className="signup_sns">
            <li className="sns_list">
              <a href="" className="signup_btn green_bg sns_1">
                네이버로 가입
              </a>
            </li>
            <li className="sns_list">
              <a href="" className="signup_btn yellow_bg sns_2">
                카카오로 가입
              </a>
            </li>
            <li className="sns_list">
              <a href="" className="signup_btn white_bg sns_3">
                Google로 가입
              </a>
            </li>
            <li className="sns_list">
              <a href="" className="signup_btn black_bg sns_4">
                Apple로 등록
              </a>
            </li>
          </ul> */}
          <div className="login_back">
            <p className="login_info">
              이미 가입하셨나요?
              <Link href="/auth/signin">
                <a className="login_goto">로그인하기</a>
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
