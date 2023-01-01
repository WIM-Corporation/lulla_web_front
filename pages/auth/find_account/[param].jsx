import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Header from "@/components/common/Header";
import VerifyForm from "@/components/Auth/VerifyForm";
import TextField from "@/components/Auth/TextField";
import PopUp, { PopUpBasicBody } from "@/components/common/PopUp";
import joinStore from "@/stores/joinStore"; // 양아치 스타일

export default function FindAccount() {
  const router = useRouter();
  const { param } = router.query;
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isFindedEmail, setIsFindedEmail] = useState(false);
  const [userNmae, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [inPw, setInPw] = useState("");
  const [inPwCk, setInPwCk] = useState("");

  // Event Handler
  const handleSuccess = (params) => {
    joinStore.saveInfo(params.name, params.phone);
    if (param === "id") {
      // 아이디 찾기 API 통신
      axios({
        method: "post",
        url: "/api/v1/auth/find-email",
        data: params,
      })
        .then(({ data: respData }) => {
          // console.log(respData);
          if (respData.resultCode == 1) {
            // 가입된 계정이 있는 경우
            setUserName(params.name);
            setUserEmail(respData.data.email);
            setIsFindedEmail(true);
            // 팝업 결과창 띄우기 (화면 1-2-4, web 설계서 22장 참고)
            setIsOpenPopup(true);
          } else if (respData.resultCode == -310) {
            // 가입된 계정이 없는 경우
            setIsFindedEmail(false);
            setIsOpenPopup(true);
            // } else if( respData.resultCode == -100 ) { // SMS인증 안함 == 정상 플로우에는 나오지 않음
          } else {
            console.warn(respData);
            alert(respData.message);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
        });
    } else {
      // 비밀번호 찾기 페이지 이동
      router.push("/auth/find_account/reset");
    }
  };

  const handleClose = () => {
    setIsOpenPopup(false);
  };

  const popupParams = isFindedEmail
    ? {
        okBtn: "로그인",
        onOkBtnClick: (e) => {
          router.replace("/auth/signin");
          setIsOpenPopup(false);
        },
        cancelBtn: "비밀번호 찾기",
        onCancelBtnClick: (e) => {
          router.replace("/auth/find_account/password");
          setIsOpenPopup(false);
        },
        children: (
          <>
            {userNmae} 회원님의 이메일 계정은 <br />
            <b>{userEmail}</b> 입니다.
          </>
        ),
      }
    : {
        okBtn: "회원가입",
        onOkBtnClick: (e) => {
          router.replace("/auth/signup");
          setIsOpenPopup(false);
        },
        cancelBtn: "닫기",
        onCancelBtnClick: (e) => setIsOpenPopup(false),
        children: (
          <>
            가입된 회원 정보가 없습니다.
            <br />
            입력 정보를 다시 확인해주세요.
          </>
        ),
      };

  let isPwResetDisable = !(inPw && inPw.length > 7 && inPw == inPwCk);
  const handlePasswordReset = (e) => {
    axios({
      method: "post",
      url: "/api/v1/auth/resetpw",
      data: {
        name: joinStore.joinName,
        phone: joinStore.joinPhone,
        password: inPw,
      },
    })
      .then(({ data: respData }) => {
        // console.log(respData);
        if (respData.resultCode == 1) {
          // 성공한 경우
          alert("성공적으로 변경되었습니다.");
          router.replace("/auth/signin");
          // } else if( respData.resultCode == -310 ) { // 가입되지 않은 사용자
          // } else if( respData.resultCode == -100 ) { // SMS인증 안함 == 정상 플로우에는 나오지 않음
        } else {
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };

  return (
    <div className="Wrap">
      <Header />
      <PopUp
        open={isOpenPopup}
        handleClose={handleClose}
        okBtn={popupParams.okBtn}
        onOkBtnClick={popupParams.onOkBtnClick}
        cancelBtn={popupParams.cancelBtn}
        onCancelBtnClick={popupParams.onCancelBtnClick}
      >
        <PopUpBasicBody>{popupParams.children}</PopUpBasicBody>
      </PopUp>
      <main className="flexCenter">
        <div className="title_box">
          <p className="title">이메일 찾기</p>
        </div>
        <section className="sec_1">
          <div className="tab_box">
            <Link href="/auth/find_account/id">
              <div className={param === "id" ? "tab_btn active" : "tab_btn"}>
                이메일 찾기
              </div>
            </Link>
            <Link href="/auth/find_account/password">
              <div className={param !== "id" ? "tab_btn active" : "tab_btn"}>
                비밀번호 찾기
              </div>
            </Link>
          </div>
          <ul className="info_form">
            <li className="info_list">
              <p className="find_text">
                {param === "reset"
                  ? "비밀번호를 재설정합니다. 새 비밀번호를 입력해주세요."
                  : "가입 시 등록한 이름과 휴대폰 번호를 입력해주세요."}
              </p>
            </li>
          </ul>
          {/* router params(id, password)에 따라 
          (1) API 함수 연결(onSubmit) 
          (2) 인증완료 후의 콜백 함수 지정(onSuccess) 
          */}
          {param !== "reset" ? (
            <VerifyForm from={param} onSuccess={handleSuccess} />
          ) : (
            <>
              <TextField
                type="password"
                name="password"
                className="info_input"
                placeholder="비밀번호 (8~20자의 영문, 숫자 조합)"
                defaultValue={inPw}
                onChange={(e) => setInPw(e.target.value)}
              />
              <TextField
                type="password"
                name="password_ok"
                className="info_input request_input warring"
                placeholder="비밀번호 확인"
                defaultValue={inPwCk}
                onChange={(e) => setInPwCk(e.target.value)}
              />
              <li className="info_list">
                <button
                  type="button"
                  name="chang_pwd"
                  className="info_btn"
                  disabled={isPwResetDisable}
                  onClick={handlePasswordReset}
                >
                  완료
                </button>
              </li>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
