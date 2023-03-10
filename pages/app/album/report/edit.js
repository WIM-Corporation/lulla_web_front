import AIAlbum from "@/components/App/Album/AIAlbum";
import { ImageTag } from "@/service/album/ImageTag";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useStores from "@/stores/useStores";
import DirectAlbum from "@/components/App/Album/DirectAlbum";
import qs from "qs";
import axios from "axios";

export default function EditPage({}) {
  const router = useRouter();
  const [initImages, setInitImages] = useState(null);
  const initData = JSON.parse(router.query.initData);
  const { reportStore } = useStores();
  const reportId = router.query.reportId;
  const tagType = initData?.tag_type;
  const deviceType =
      qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";

  useEffect(() => {
    //report to image
    console.log("initdata", initData);

    let imageData = new ImageTag();
    imageData.school_id = initData.school_id;
    imageData.class_id = initData.class_id;
    imageData.total_medias = initData.total_medias;
    imageData.medias = [initData.media];
    setInitImages(JSON.stringify(imageData));
  }, []);

  const updateTags = (result) => {
    result = JSON.parse(result);

    console.log("[updateTags] ", result, " report_id ", reportId);
    const reqBody = {...initData, tag_error_id:reportId, media:Object.assign([],result.medias)}
    const newTags = result.medias[0].tags;
    axios
      .post("/api/v1/album/error/update", reqBody)
      .then((res) => {
        reportStore.setEditFlag(true);
        // 현재시간?
        var updated_at = res?.tag_error?.updated_at;
        if(!updated_at || typeof updated_at != "string"){
          updated_at = new Date().toISOString();
        }
        console.log("updated_at ", updated_at);
        reportStore.setEditedTime(updated_at);
        reportStore.setErrorEditedTags(JSON.stringify(newTags));
        router.back();
      })
      .catch((err) => {
        alert("오류 수정 정보를 보내는데 문제가 발생하였습니다.");
        console.log("[EditPage] error : ", err.message);
      });
  };

  return (
    <div className="Wrap">
      {initImages ? (
        <main>
          {tagType === 0
            ? <AIAlbum
              memberId={initData.member_id}
              onComplete={(result) => updateTags(result)}
              onBack={() => router.back()}
              initImages={initImages}
              backBtnType="x"
              isErrorPage={true}
            />
          : tagType === 1
            ? <DirectAlbum
              initImages={initImages}
              onComplete={(result) => updateTags(result)}
              onBack={() => router.back()}
              deviceType={deviceType}
              backBtnType="x"
              isErrorPage={true}
            />
          :null
          }

        </main>
      ) : null}
    </div>
  );
}
