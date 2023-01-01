import { useState } from "react";
import { useRouter } from "next/router";

import Header from "@/components/common/Header";
import VerifyForm from "@/components/Auth/VerifyForm";
import PopUp, { PopUpBasicBody } from "@/components/common/PopUp";
import useStores from "@/stores/useStores";

export default function Verification({ prev }) {
  const router = useRouter();
  const { joinStore } = useStores();
  const [isOpen, setIsOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(true);

  const handleFailure = (e) => {
    setIsOpen(true);
  };

  const handleSuccess = (params) => {
    // params = {phone, name}
    joinStore.saveInfo(params.name, params.phone);
    router.push("/auth/signup/form");
  };

  const handlePopupClose4Signin = (e) => {
    setIsOpen(false);
    router.push("/auth/signin");
  };

  return (
    <div className="Wrap">
      <Header />
      <PopUp
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        okBtn="로그인"
        onOkBtnClick={handlePopupClose4Signin}
        cancelBtn="닫기"
      >
        <PopUpBasicBody>
          이미 등록된 번호입니다.
          <br />
          계정을 확인하고 로그인해주세요.
        </PopUpBasicBody>
      </PopUp>

      <main className="flexCenter">
        <div className="title_box">
          <p className="title">회원가입</p>
        </div>
        <section className="sec_1">
          <div className="info_box">
            <p className="sub_title">본인 인증</p>
            <div className="progress">
              <div className="progress_bar on"></div>
            </div>
          </div>

          <VerifyForm
            from="signup"
            onFailure={handleFailure}
            onSuccess={handleSuccess}
          />
        </section>
      </main>
    </div>
  );
}
