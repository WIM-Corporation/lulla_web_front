import axios from "axios";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";

import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import { initPage, back } from "@/components/App/Album/nativeCalls";

//test
import { dummyReportData } from "@/components/App/Album/Common/Test";
import { ReportContainer } from "@/components/App/Album/TagError/TagErrorPage";
import { errMsg } from "@/components/common/Utils";
import qs from "qs";
import { Report } from "@/service/album/Report";

export default function ReportPage() {
  const isWebTestMode = false;

  const reportId = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );
  const deviceType =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";

  const report = useRef(new Report(reportId));
  const auth = useRef(null);
  const [ready, setReady] = useState(false);

  function getReport(member_id, tag_error_id) {
    axios
      .post("/api/v1/album/error", { member_id, tag_error_id })
      .then((res) => {
        if (typeof res.tag_error?.school_id === undefined) {
          throw new Error("유치원 정보가 필요합니다.");
        }

        if (typeof res.tag_error?.media === undefined) {
          throw new Error("이미지 정보가 필요합니다.");
        }

        if (
          typeof res.tag_error?.total_medias === undefined ||
          typeof res.tag_error?.media[0].seq === undefined
        ) {
          throw new Error("몇번째 사진인지 정보가 필요합니다.");
        }

        // //TODO: discuss a format difference btw BE or native
        // // BE : media -> array
        // // native : media -> json
        if (typeof res.tag_error.media != "object") {
          res.tag_error.media = JSON.parse(res.tag_error.media);
        }

        res.tag_error.media = res.tag_error.media[0];
        report.current.init = res.tag_error;
        report.current.setReporter = res.rsMember;
        console.log("report : ", report.current);
        setReady(true);
      })
      .catch((err) => {
        alert("태그 오류 정보를 불러오는데 문제가 발생하였습니다. ");
        console.log("[getReport] error : ", err.message);
        if (isWebTestMode) {
          return dummyReportData;
        }
      });
  }

  useEffect(() => {
    initPage(deviceType, auth);

    let _initWait = setInterval(() => {
      if (auth.current.token && reportId) {
        clearInterval(_initWait);
        getReport(auth.current.memberId, reportId);
      }
    }, 500);
    setTimeout(() => clearInterval(_initWait), 5000);
  }, []);

  return (
    <div className="Wrap">
      <main>
        <AlbumHeader
          onBackBtn={() => back(deviceType)}
          title={"태그 오류 알림"}
        />
        {auth.current && ready ? (
          <ReportContainer report={report.current} />
        ) : null}
      </main>
    </div>
  );
}
