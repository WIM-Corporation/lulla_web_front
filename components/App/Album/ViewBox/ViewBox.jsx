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
  openModal,
  setCurrentIdx,
  currentIdx,
  tagType = "bubble",
  isAiTag,
  showTag,
  tagBox = false,
}) => {
  const imgAreaBox = useRef(null);

  // common
  const [loading, setLoading] = useState(false);

  // medias
  const [totalMedias, setTotalMedias] = useState(null);

  // const currentIdx = useRef(null);
  const [curImg, setCurImg] = useState(null);
  const [img, setImg] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [tags, setTags] = useState(null);

  // touch event
  const touchTimerRef = useRef({
    now: null,
    timerId: null,
    interval: 10,
    triggerTime: 2500,
  });

  let touchstartX = 0;
  let touchendX = 0;

  const setTouchStart = (e) => {
    if (!loading && img && imgSrc) {
      touchstartX = e.changedTouches[0].screenX; //image swipe

      touchTimerRef.current.timerId = setInterval(() => {
        e.preventDefault();
        //long touch
        if (touchTimerRef.current.now > touchTimerRef.current.triggerTime) {
          if (mediaArray.length > 1) {
            // ViewBox code is an ugly mess.
            // And below code is just a stopgap. Please refactoring !

            openModal && openModal("delete");
            //TODO: 1. create modal manager instead of using leaveXX functions
            //TODO: 2. useContext or reducer -> manage the state (backkey, modal show.. etc) instead of using actionLog
            //TODO: 3. split touch Events as handler function which gunna bind to viewBox ref <ViewBox {...touchHandler}>
            //TODO: 4. use fetch for editor view
            //TODO: 5. reduce useState

            touchTimerRef.current.now = 0;
            clearInterval(touchTimerRef.current.timerId);
          }
        } else {
          touchTimerRef.current.now =
            touchTimerRef.current.now + touchTimerRef.current.interval;
        }
      }, 1);
    }
  };

  const setTouchEnd = (e) => {
    if (!loading && img && imgSrc) {
      if (touchTimerRef.current.timerId) {
        //long touch
        clearInterval(touchTimerRef.current.timerId);
        touchTimerRef.current.now = 0;
      }
      //image swipe
      touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX && touchstartX - touchendX > 100) {
        if (currentIdx + 1 < mediaArray.length) {
          setCurrentIdx(currentIdx + 1);
        } else if (mediaArray.length > 1) {
          alert("다음 이미지가 없습니다.");
        }
      } else if (touchendX > touchstartX && touchendX - touchstartX > 100) {
        if (currentIdx > 0) {
          setCurrentIdx(currentIdx - 1);
        } else if (mediaArray.length > 1) {
          alert("이전 이미지가 없습니다.");
        }
      }
    }
  };

  // touch event end

  useEffect(() => {
    setImg(new window.Image());
    setLoading(true);
    console.log("!setImg");
    total ? setTotalMedias(total) : setTotalMedias(mediaArray.length);
  }, []);

  function reRender(idx) {
    const curImage = mediaArray[idx];
    setCurImg(curImage);

    if (curImage?.mime_type?.startsWith("video")) {
      alert("not implemented yet!");
      setIsVideo(true);
    } else {
      setIsVideo(false);
      setImgSrc(parseImageSrc(curImage));
      setTags(isAiTag && showTag ? curImage.tags : []);
      console.log("!setImgSrc");
    }
  }
  useEffect(() => {
    if (currentIdx !== null) {
      setTags([]);
      setImg(new window.Image());
      setLoading(true);
      reRender(currentIdx);
    }
  }, [currentIdx,showTag]);
  return (
    <>
      <div
        ref={imgAreaBox}
        className="view_box"
        onTouchStart={setTouchStart}
        onTouchEnd={setTouchEnd}
      >
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
          tags &&
          tagBox && (
            <TagArea
              tagType={tagType}
              tags={tags}
              img={img}
              imgAreaBox={imgAreaBox}
            />
          )
        )}

        {totalMedias > 0 && curImg && (
          <>
            <CountView current={1 + curImg.seq} total={totalMedias} />
            {tagBox && (
              <div className="tag_info" onClick={openModal("tag-list")} onClick={onClickTagInfo}>
                <Image src={TagIcon} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
