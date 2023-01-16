import authStore from "@/stores/Auth";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import AlbumTagSelect from "../AlbumTagSelect";
import AlbumHeader from "./Common/AlbumHeader";
import { initAuth, initPage } from "./nativeCalls";
import { ViewBox } from "./ViewBox/ViewBox";

export default function DirectAlbum({
  initImages,
  onComplete,
  onBack,
  deviceType, // TODO: redux / session storage
}) {
  const [mediaArray, setMediaArray] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [kidList, setKidList] = useState([]);
  const [totalMedias, setTotalMedias] = useState(null);
  const [cancelPopup, showCancelPopup] = useState(false);
  const [width, setWidth] = useState(null);

  const [currentIdx, setCurrentIdx] = useState(0);

  const handleComplete = (e) => {
    const result = {};

    if (onComplete) {
      onComplete(result);
    }
  };

  function getKidList(school_id, class_id) {
    let class_name = null;
    let kid_list = [];
    axios
      .post("/api/v1/kid/list/class", { school_id, class_id })
      .then((res) => {
        console.log("[getKidList] kid/list/class Data : ", res);

        class_name = res.class_name;
        if (!class_name) {
          throw new Error("Class 정보가 없습니다.");
        }

        kid_list = res.kid_list;
        if (!kid_list) {
          throw new Error(class_name + "반의 원아 정보가 없습니다");
        }

        setClassName(class_name);
        setKidList(kid_list);
      })
      .catch((err) => {
        console.error("[getKidList] Failed : ", err);
        alert("통신에 문제가 발생하였습니다.");
        setClassName("");
        setKidList([]);
      });
  }

  const initDataset = (data) => {
    setSchoolId(data.school_id);
    setClassId(data.class_id);
    setTotalMedias(data.total_medias);
    setMediaArray(data.medias);
    getKidList(data.school_id, data.class_id);
  };

  const handleSelectKid = useCallback((e) => {
    e.stopPropagation();

    const tagIdx = e.target.getAttribute("data-tag-idx"); // TODO 유효성 검사?
    const item = kidList[tagIdx];

    const curImage = mediaArray[currentIdx];
    const newTagList = [...curImage.tags];

    /* check new kid tag */
    const idx = newTagList.findIndex(
      (tagItem) => tagItem.kid_id == item.kid_id
    );

    e.target.parentElement.style.transition = "all ease 1s";
    e.target.parentElement.style.webkitTransition = "all ease 1s";

    const selected = idx < 0;

    // create or remove from tag list
    if (selected) {
      // TODO: 직접 태그의 tag 포맷 확인 필요
      newTagList.push({
        kid_id: item.kid_id,
        kid_name: item.kid_name,
        class_id: item.class_id,
        class_name: className || "-",
        bbox: null,
        by_user: false,
        id: "",
      });
    } else {
      newTagList.splice(idx, 1);
    }

    // e.target.parentNode.setAttribute("selected", selected);
    e.target.parentElement.setAttribute("data-selected", selected);
    const newMediaArray = mediaArray;
    newMediaArray[currentIdx].tags = newTagList;
    setMediaArray(newMediaArray);
  });

  const setImages = (dataStr) => {
    const data = JSON.parse(dataStr);
    //check data type
    try {
      initDataset(data);
    } catch (error) {
      console.error("[setImage] failed ", error.message);
      alert("이미지 초기화에 실패하였습니다.");
      return;
    }
  };

  useEffect(() => {
    window.setImages = setImages;
    if (initImages) {
      setImages(initImages);
    } else {
      initPage(deviceType);
    }

    const resize = () => setWidth(window.outerWidth);
    window.addEventListener("resize", resize);
    resize();

    window.backKey = function () {
      //TODO:
      window.app.cancel();
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.backKey = null;
    };
  }, []);

  return (
    <>
      <AlbumHeader
        onConfirm={handleComplete}
        title={"직접 태그"}
        activeBtn={true}
        onBackBtn={() => showCancelPopup()}
        infoBtn
      />
      {mediaArray && mediaArray.length > 0 && (
        <>
          <ViewBox
            mediaArray={mediaArray}
            total={totalMedias}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            openModal={(type) => {
              if (type == "delete")
                alert("삭제 기능은 직접 태그에서는 지원되지 않습니다.");
            }}
          />
          <AlbumTagSelect
            kidList={kidList}
            onClickKid={handleSelectKid}
            imageListData={mediaArray}
            currentIdx={currentIdx}
            editMode
          />
        </>
      )}
    </>
  );
}
