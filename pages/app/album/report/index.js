import axios from "axios";
import { useRef, useState, useEffect } from "react";

import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import { initPage, back, initAuth } from "@/components/App/Album/nativeCalls";
import { dummyErrorImageData } from "@/components/App/Album/Common/Test";
import WarnPopup from "@/components/common/WarnPopup";
import { ReportContainer } from "@/components/App/Album/TagError/TagErrorPage";
import { errMsg } from "@/components/common/Utils";
import { Report } from "@/service/album/Report";
import qs from "qs";
import useStores from "@/stores/useStores";

// TODO: ts or set prototype, 분리
export default function ReportCreatePage() {
  const isWebTestMode = false;
  const [activeSendBtn, setSendBtnActive, activeSendBtnRef] = useState(false);
  const deviceType =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";

  const [ready, setReady] = useState(false);
  const { authStore } = useStores();

  const [cancelPopup, showCancelPopup, cancelPopupRef] = useState(false);
  const report = useRef(new Report());

  const sendError = (e) => {
    // report.current.content = textRef.current.value;
    let reqBody = report.current.output;
    reqBody.media = [reqBody.media];
    console.log("[sendError] report : ", reqBody);

    axios
      .post("/api/v1/album/detail", {id:reqBody.album_id,member_id:reqBody.member_id})
      .then((res) => {
        let seq = reqBody.media[0].seq;
        if(res?.album?.medias[seq]){
            let album_media_id = res.album.medias[seq].id;
            reqBody.album_media_id = album_media_id;
            axios
              .post("/api/v1/album/error/create", reqBody)
              .then((res) => {
                back(deviceType);
              })
              .catch((err) => {
                alert(errMsg("오류 보내기에 문제가 발생하였습니다. ", err));
                console.log("[getReport] error : ", err.message);
                return false;
              });
        }
      })
  };

  const setImage = (dataStr) => {
    const data = JSON.parse(dataStr);
    report.current.init = data;
  };

  useEffect(() => {
    console.log("init report page");
    initAuth(deviceType, authStore);

    let _initWait = setInterval(() => {
      if (
        authStore.token &&
        report &&
        report.current.schoolId &&
        report.current.classId
      ) {
        clearInterval(_initWait);
        report.current.memberId = authStore.memberId;
        setReady(true);
      }
    }, 500);
    setTimeout(() => clearInterval(_initWait), 5000);

    if (window) {
      window.setImage = setImage;
    }
    initPage(deviceType);

    if (isWebTestMode) {
      setImage(JSON.stringify(dummyErrorImageData));
    }
  }, []);

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
