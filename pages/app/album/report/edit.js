import AIAlbum from "@/components/App/Album/AIAlbum";
import { ImageTag } from "@/service/album/ImageTag";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPage({}) {
  const router = useRouter();
  const [initImages, setInitImages] = useState(null);
  const initData = JSON.parse(router.query.initData);
  const [sourceTag,setSourceTag] = useState(null);
  
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

  const handleComplete = (data, popFunc) => {
    if(typeof popFunc == 'function'){
      popFunc();
    }
  
  }
  return (
    <div className="Wrap">
      {initImages ? (
        <main>
          <AIAlbum
            memberId={initData.member_id}
            onComplete={handleComplete}
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
