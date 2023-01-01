import NavHeader from "@/components/Layouts/NavHeader";
import CreateTeacherForm from "./CreateTeacherForm";
import PopUp, { PopUpBasicBody } from "@/components/common/PopUp";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default (props) => {
  const router = useRouter();
  const [popUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
        // router.push("/auth/signup/warning");
        setPopUpOpen(true);
        return;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  return (
    <div className="Wrap side_layout">
      <div className="container full">
        <NavHeader />
        <PopUp
          open={popUpOpen}
          okBtn={"확인"}
          onOkBtnClick={() => {
            setPopUpOpen(false);
            router.push("/member/append/select");
          }}
          cancelBtn={"취소"}
          onCancelBtnClick={() => {
            router.replace("/member/append/teacher");
            setPopUpOpen(false);
          }}
        >
          <PopUpBasicBody>
            {
              <>
                이전 화면으로 이동할 경우
                <br />
                본인인증이 재진행됩니다.
              </>
            }
          </PopUpBasicBody>
        </PopUp>
        <CreateTeacherForm />
      </div>
    </div>
  );
};
