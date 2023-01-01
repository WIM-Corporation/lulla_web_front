import axios from "axios";
import React, { useEffect, useRef } from "react";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";

import useStores from "@/stores/useStores";
import useInput from "@/lib/hooks/useInput";
import Header from "@/components/common/Header";
import TextField from "@/components/Auth/TextField";
import useLoading from "@/lib/hooks/useLoading";
import { observer } from "mobx-react-lite";

const SignInPage = observer(() => {
  const router = useRouter();
  const { authStore, globalStore } = useStores();

  /* Test 계정
    ID: text99@email.com
    PWD: a12345678
  */
  const ref = useRef(null);
  const initialState = { email: "", password: "" };
  const initialError = { email: false, password: false };
  const { handleStatus, error, handleError, message, handleMessage } =
    useLoading("initial", {
      initialError: initialError,
      initialMsg: initialState,
    });
  const { inputs, setInputs, handleChange } = useInput(initialState, {
    cb: ({ name }) => {
      handleError(initialError);
      handleMessage(initialState);
    },
  });
  const { email, password } = inputs;

  /* 로그인 버튼 */
  const handleSignin = (e) => {
    e.preventDefault();
    // 유효성 검사
    const emailValidation =
      /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;

    if (!String(email).match(emailValidation)) {
      handleStatus("error");
      handleError({ email: true, password: false });
      handleMessage({ ...initialState, email: "이메일을 다시 확인해주세요." });
      return;
    }

    // 통신
    axios({
      method: "POST",
      url: "/api/v1/auth/signin",
      data: inputs,
    })
      .then(async ({ data: respData }) => {
        if (respData.resultCode > 0) {
          // console.log(resp.data);
          const { data } = respData;
          authStore.signIn(data.authToken);
          await authStore.initMemberList();
          if (!authStore.curMember && authStore.memberList.length === 0) {
            router.push("/member/append/select");
            return;
          }
          router.push("/notice");
          if (!authStore.curMember) {
            globalStore.setProfileChangeModalHidden(false);
          }
        } else {
          console.warn(respData);
          // alert(respData.message);
          handleError({ email: true, password: true });
          handleMessage({
            email: "",
            password: "아이디 또는 비밀번호를 확인해주세요.",
          });
          setInputs({ ...inputs, password: "" });
          ref.current.focus();
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("통신에 문제가 발생하였습니다.");
      });
  };

  useEffect(() => {
    // Mount될때, TextField 초기화
    setInputs(initialState);
    handleError(initialError);
  }, []);

  return (
    <div className="Wrap">
      <Header />
      <main className="flexCenter">
        <div className="title_box">
          <p className="title">로그인</p>
        </div>
        <form className="sec_1" onSubmit={handleSignin}>
          <ul className="info_form">
            <TextField
              type="email"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={handleChange}
              error={error?.email}
              helperText={message?.email}
            />
            <TextField
              ref={ref}
              type="password"
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={handleChange}
              error={error?.password}
              helperText={message?.password}
            />

            <li className="info_list">
              <button
                type="submit"
                name="login_btn"
                className="info_btn"
                disabled={Object.values(inputs).includes("")}
              >
                로그인
              </button>
            </li>
            <li className="info_list">
              <div className="find_box">
                <Link href="/auth/find_account/id">
                  <a className="find_link">이메일 찾기</a>
                </Link>
                <Link href="/auth/find_account/password">
                  <a className="find_link">비밀번호 찾기</a>
                </Link>
              </div>
            </li>
          </ul>
          {/* OAuth 간편 로그인은 추후 추가 개발 사항 
          <div className="middle_line">
            <p className="or_text">또는</p>
          </div>

          <ul className="signup_sns">
            <li className="sns_list">
              <a
                href="javascript:void(0);"
                className="signup_btn green_bg sns_1"
                onClick={(e) => e.preventDefault()}
              >
                네이버로 로그인
              </a>
            </li>
            <li className="sns_list">
              <a
                href="javascript:void(0);"
                className="signup_btn yellow_bg sns_2"
                onClick={(e) => e.preventDefault()}
              >
                카카오로 로그인
              </a>
            </li>
            <li className="sns_list">
              <a
                href="javascript:void(0);"
                className="signup_btn white_bg sns_3"
                onClick={(e) => e.preventDefault()}
              >
                Google로 로그인
              </a>
            </li>
            <li className="sns_list">
              <a
                href="javascript:void(0);"
                className="signup_btn black_bg sns_4"
                onClick={(e) => e.preventDefault()}
              >
                Apple로 로그인
              </a>
            </li>
          </ul> */}
          <div className="login_back">
            <p className="login_info">
              랄라가 처음이신가요?
              <Link href="/auth/signup">
                <a className="login_goto">회원가입하기</a>
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
});

const SignIn = (props) => <SignInPage {...props} />;
export default SignIn;
