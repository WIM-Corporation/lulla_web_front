import AIAlbum from "@/components/App/Album/AIAlbum";
import { ImageTag } from "@/service/album/ImageTag";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPage({}) {
  const router = useRouter();
  const [initImages, setInitImages] = useState(null);
  const initData = JSON.parse(router.query.initData);
  const [sourceTag,setSourceTag] = useState(null);

  const reportId = router.query.reportId;

  useEffect(() => {
    //report to image
    console.log("router", router.query);
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
    axios
      .post("/api/v1/album/error/update", {
        member_id: initData.member_id,
        tag_error_id: reportId,
        media_width: result.medias[0].width,
        media_height: result.medias[0].height,
        delete_tags: result.medias[0].delete_tags || [],
        tags: result.medias[0].tags,
      })
      .then((res) => {
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
          <AIAlbum
            memberId={initData.member_id}
            onComplete={handleComplete}
            onComplete={(result) => updateTags(result)}
            onBack={() => router.back()}
            initImages={initImages}
            backBtnType="x"
            isErrorPage={true}
            sourceTags={initData.media?.tags}
          />
        </main>
      ) : null}
    </div>
  );
}
