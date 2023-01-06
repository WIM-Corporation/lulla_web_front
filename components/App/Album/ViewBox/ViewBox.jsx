import Loading from "../Common/Loading";
import FullCanvas from "../TagCanvas/FullCanvas";
import TagArea from "../TagCanvas/TagArea";
import Image from "next/image";
import TagIcon from "@/assets/imgs/tag_fill.svg";
import CountView from "../CountView";
import { useEffect, useRef, useState } from "react";
import { encodeImage } from "@/components/common/Utils";

function parseImageSrc(mediaData) {
  let src = null;
  if (mediaData?.data) {
    src = encodeImage(mediaData.data);
  } else if (mediaData?.image_url) {
    src = mediaData.image_url;
  } else {
    alert("이미지 인식에 실패하였습니다.");
  }
  return src;
}

export const ViewBox = ({
  mediaArray,
  total,
  onClickTagInfo,
  idx = 0,
  tagType = "bubble",
}) => {
  const imgAreaBox = useRef(null);

  // common
  const [loading, setLoading] = useState(false);

  // medias
  const [totalMedias, setTotalMedias] = useState(null);

  const currentIdx = useRef(null);
  const [curImg, setCurImg] = useState(null);
  const [img, setImg] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [tags, setTags] = useState(null);

  useEffect(() => {
    setImg(new window.Image());
    setLoading(true);
    console.log("!setImg");
    currentIdx.current = idx;
    total ? setTotalMedias(total) : setTotalMedias(mediaArray.length);
  }, []);

  useEffect(() => {
    if (currentIdx.current !== null) {
      setTags([]);
      setImg(new window.Image());
      setLoading(true);

      const curImage = mediaArray[currentIdx.current];
      setCurImg(curImage);

      if (curImage?.mime_type?.startsWith("video")) {
        alert("not implemented yet!");
        setIsVideo(true);
      } else {
        setIsVideo(false);
        setImgSrc(parseImageSrc(curImage));
        setTags(curImage.tags);
        console.log("!setImgSrc");
      }
    }
  }, [currentIdx]);

  return (
    <>
      <div ref={imgAreaBox} className="view_box">
        <FullCanvas
          loading={loading}
          img={img}
          imgSrc={imgSrc}
          onLoad={() => setLoading(false)}
          resizing
        />
        {loading ? (
          <Loading />
        ) : (
          <TagArea
            tagType={tagType}
            tags={tags}
            img={img}
            imgAreaBox={imgAreaBox}
          />
        )}

        {totalMedias > 0 && curImg && (
          <>
            <CountView current={1 + curImg.seq} total={totalMedias} />
            {onClickTagInfo && (
              <div className="tag_info" onClick={onClickTagInfo}>
                <Image src={TagIcon} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
