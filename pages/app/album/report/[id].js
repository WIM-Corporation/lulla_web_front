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

export default function ReportPage() {
  const isWebTestMode = false;

  const reportId = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );
  const deviceType =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";

  const [report, setReport] = useState(null);
  const auth = useRef(null);

  async function getReportProps(member_id, tag_error_id) {
    const report = await axios
      .post("/api/v1/album/error", { member_id, tag_error_id })
      .then((res) => {
        if (typeof res.school_id === undefined) {
          throw new Error("유치원 정보가 필요합니다.");
        }

        if (typeof res.media === undefined) {
          throw new Error("이미지 정보가 필요합니다.");
        }

        if (
          typeof res.total_medias === undefined ||
          typeof res.media.seq === undefined
        ) {
          throw new Error("몇번째 사진인지 정보가 필요합니다.");
        }

        return res;
      })
      .catch((err) => {
        alert("태그 오류 정보를 불러오는데 문제가 발생하였습니다. ");
        console.log("[getReport] error : ", err.message);
        if (isWebTestMode) {
          return dummyReportData;
        }
        return null;
      });

    return report;
  }

  useEffect(() => {
    initPage(deviceType, auth);

    let _initWait = setInterval(() => {
      if (auth.current.token && reportId) {
        clearInterval(_initWait);
        getReportProps(auth.current.memberId, reportId).then((res) => {
          setReport(res);
        });
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
        {auth.current && report ? <ReportContainer report={report} /> : null}
      </main>
    </div>
  );
}
