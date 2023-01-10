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
  onChangeMedia,
  onClickTagInfo,
  isEditMode,
  idx = 0,
  tagType = "bubble",
}) => {
  const imgAreaBox = useRef(null);

  // common
  const [loading, setLoading] = useState(false);

  // medias
  const [totalMedias, setTotalMedias] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [curImg, setCurImg] = useState(null);
  const [img, setImg] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [tags, setTags] = useState(null);

  //init
  useEffect(() => {
    console.log("!setImg");
    setImg(new window.Image());
    setLoading(true);
    setCurrentIdx(idx);
    total ? setTotalMedias(total) : setTotalMedias(mediaArray.length);
  }, []);

  // changed mediaArray props (tags...)
  useEffect(() => {
    console.log("media array : ", mediaArray, " curidx : ", currentIdx);
    const _cur = mediaArray[currentIdx];
    if (_cur.tags !== tags) {
      setTags(_cur.tags); // only re-render tags
    }
  }, [mediaArray]);

  // TODO: useReducer for this (refactoring)
  useEffect(() => onChangeImage(), [currentIdx]);

  function onChangeImage() {
    //setDrawTag(false);
    if (currentIdx !== null) {
      setTags([]);
      setImg(new window.Image());
      setLoading(true);

      const curImage = mediaArray[currentIdx];
      setCurImg(curImage);

      if (curImage?.mime_type?.startsWith("video")) {
        setIsVideo(true);
      } else {
        setIsVideo(false);
        setImgSrc(parseImageSrc(curImage));
        setTags(curImage.tags);
        console.log("!setImgSrc");
      }
    }
    if (onChangeMedia) onChangeMedia(isVideo, currentIdx);
  }

  let touchstartX = 0;
  let touchendX = 0;
  const touchTimerRef = useRef({
    now: null,
    timerId: null,
    interval: 10,
    triggerTime: 2500,
  });

  const setTouchStart = (e) => {
    if (!isEditMode && !loading && img && imgSrc) {
      touchstartX = e.changedTouches[0].screenX; //image swipe

      touchTimerRef.current.timerId = setInterval(() => {
        e.preventDefault();
        //long touch
        if (touchTimerRef.current.now > touchTimerRef.current.triggerTime) {
          touchTimerRef.current.now = 0;
          clearInterval(touchTimerRef.current.timerId);
          // setDeletePopup(true);
          // actionLog.current = Mode.;
        } else {
          touchTimerRef.current.now =
            touchTimerRef.current.now + touchTimerRef.current.interval;
        }
      }, 1);
    }
  };

  const setTouchEnd = (e) => {
    if (!isEditMode && !loading && img && imgSrc) {
      if (touchTimerRef.current.timerId) {
        //long touch
        clearInterval(touchTimerRef.current.timerId);
        touchTimerRef.current.now = 0;
      }

      //image swipe
      touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX && touchstartX - touchendX > 150) {
        if (currentIdx + 1 < imageArray.length) {
          changeImg(currentIdx + 1);
        } else if (mediaArray.length > 1) {
          alert("다음 이미지가 없습니다.");
        }
      } else if (touchendX > touchstartX && touchendX - touchstartX > 150) {
        if (currentIdx > 0) {
          setCurrentIdx(currentIdx - 1);
        } else if (mediaArray.length > 1) {
          alert("이전 이미지가 없습니다.");
        }
      }
    }
  };

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
