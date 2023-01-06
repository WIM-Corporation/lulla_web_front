import axios from "axios";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";

import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import { initPage, back } from "@/components/App/Album/nativeCalls";
import { dummyErrorImageData } from "@/components/App/Album/Common/Test";
import WarnPopup from "@/components/common/WarnPopup";
import { ReportContainer } from "@/components/App/Album/TagError/TagErrorPage";
import { errMsg } from "@/components/common/Utils";
import { Report } from "@/service/album/Report";

// TODO: ts or set prototype, 분리
export default function ReportCreatePage() {
  const isWebTestMode = true;
  const [activeSendBtn, setSendBtnActive, activeSendBtnRef] = useState(false);
  const deviceType = useRouter().query.type || "web";

  const [ready, setReady] = useState(false);
  const auth = useRef(null);

  const [cancelPopup, showCancelPopup, cancelPopupRef] = useState(false);
  const report = useRef(new Report());

  const sendError = (e) => {
    // report.current.content = textRef.current.value;
    console.log("[sendError] report : ", report.current.output);
    axios
      .post("/api/v1/album/error/create", report.current.output)
      .then((res) => {
        back(deviceType);
      })
      .catch((err) => {
        alert(errMsg("오류 보내기에 문제가 발생하였습니다. ", err));
        console.log("[getReport] error : ", err.message);
        return false;
      });
  };

  const setImage = (dataStr) => {
    const data = JSON.parse(dataStr);
    report.current.init = data;
  };

  useEffect(() => {
    console.log("init report page");
    initPage(deviceType, auth);
    if (window) {
      window.setImage = setImage;
    }

    if (isWebTestMode) {
      setImage(JSON.stringify(dummyErrorImageData));
    }
  }, []);

  useEffect(() => {
    let _initWait = setInterval(() => {
      if (report && report.current.schoolId && report.current.classId) {
        clearInterval(_initWait);
        report.current.memberId = auth.current.memberId;
        setReady(true);
      }
    }, 500);
    setTimeout(() => clearInterval(_initWait), 5000);
  }, [auth]);

  return (
    <div className="Wrap">
      {ready ? (
        <main>
          <AlbumHeader
            onBackBtn={() => showCancelPopup(true)}
            onConfirm={sendError}
            activeBtn={activeSendBtn}
            title={"태그 오류 보내기"}
          />
          <ReportContainer
            report={report.current}
            onWrite={(text) => {
              report.current.content = text;
              setSendBtnActive(text.length > 0);
            }}
          />
        </main>
      ) : null}
      <WarnPopup
        show={cancelPopup}
        title={`작성 중인 내용이 삭제됩니다.
        태그 오류 보내기 작성을 그만 하시겠습니까?`}
        onClose={() => showCancelPopup(false)}
        onConfirm={() => back(deviceType)}
      />
    </div>
  );
}