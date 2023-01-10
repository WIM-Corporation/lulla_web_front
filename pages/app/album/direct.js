import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import { initPage } from "@/components/App/Album/nativeCalls";
import { ViewBox } from "@/components/App/Album/ViewBox/ViewBox";
import { ImageTag } from "@/service/album/ImageTag";
import qs from "qs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Album from ".";

// mode to handle back-key
const Mode = {
  AI_TAGGING: "aiTagging",
  CANCEL_POPUP: "cancelPopup",
  DELETE_POPUP: "deletePopup",
  EDIT_MODE: "editMode",
  NONE: null,
};
Object.freeze(Mode);

export const DirectPage = ({ props }) => {
  const deviceType =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";
  const [ready, setReady] = useState(false);

  const [isCompleted, activeCompleteBtn] = useState(false);
  const [cancelPop, showCancelPopup] = useState(false);

  const [curImage, setCurImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const auth = useRef(null);
  const appData = useRef(new ImageTag());
  const actionLog = useRef(Mode.NONE);

  const setImages = (dataStr) => {
    const data = JSON.parse(dataStr);
    try {
      // valid & init app return data
      appData.current.init = data;
      // cur image
    } catch (err) {
      console.error("failed setImages : " + err.message);
      alert("이미지 초기화에 실패하였습니다.");
      return;
    }
  };

  useEffect(() => {
    initPage(deviceType, auth);
    if (window) window.setImages = setImages;
  }, []);

  const onComplete = () => {};

  return (
    <Album>
      <AlbumHeader
        title={"태그 하기"}
        onConfirm={onComplete}
        activeBtn={isCompleted}
        onBackBtn={() => showCancelPopup()}
        infoBtn
      />
      {appData.current && (
        <ViewBox
          mediaArray={appData.current.medias}
          total={appData.current.total_medias}
          idx={currentIdx}
          onChangeMedia={onChangeMedia}
        />
      )}
      <KidSelectBox />
    </Album>
  );
};
