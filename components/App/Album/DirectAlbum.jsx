import authStore from "@/stores/Auth";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import AlbumTagSelect from "../AlbumTagSelect";
import AlbumHeader from "./Common/AlbumHeader";
import { initAuth, initPage } from "./nativeCalls";
import { ViewBox } from "./ViewBox/ViewBox";
import WarnPopup from "@/components/common/WarnPopup";

export default function DirectAlbum({
  initImages,
  onComplete,
  onBack,
  deviceType, // TODO: redux / session storage
  backBtnType,
  isErrorPage,
}) {
  const [mediaArray, setMediaArray] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [kidList, setKidList] = useState([]);
  const [totalMedias, setTotalMedias] = useState(null);
  const [cancelPopup, showCancelPopup] = useState(false);
  const [cancelPopFrom, setCancelPopFrom] = useState("");
  const [cancelPopMsg, setCancelPopMsg] = useState("");
  const [width, setWidth] = useState(null);
  const [classList, setClassList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCnt, setSelectedCnt] = useState([]);
  const [sourceTags, setSourceTags] = useState(null);
  const [isEditTags, editTags] = useState(false);

  const handleComplete = (e, checkedSourceTags) => {
    if (onComplete) {
      const resultJsonStr = JSON.stringify({
        school_id: schoolId,
        class_id: classId,
        total_medias: totalMedias,
        medias: mediaArray.map((media) => ({
          ...media,
          data: "",
          tags: media.tags.map((tag) => ({ ...tag, bbox: [0, 0, 0, 0] })),
        })),
        deleted_medias_seq: [],
      });

      if (!isErrorPage) {
        onComplete(resultJsonStr);
      }else{
        if(mediaArray[0].tags.length > 0 || checkedSourceTags){
          onComplete(resultJsonStr);
        }else{
          showWarnPopup('onConfirm');
        }        
      }
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
          throw new Error("Class ????????? ????????????.");
        }

        kid_list = res.kid_list;
        if (!kid_list) {
          throw new Error(class_name + "?????? ?????? ????????? ????????????");
        }

        setClassName(class_name);
        setKidList(kid_list);
      })
      .catch((err) => {
        console.error("[getKidList] Failed : ", err);
        alert("????????? ????????? ?????????????????????.");
        setClassName("");
        setKidList([]);
      });
  }

  const initDataset = (data) => {
    setSchoolId(data.school_id);
    setClassId(data.class_id);
    setTotalMedias(data.total_medias);
    setMediaArray(data.medias);
    if (isErrorPage) {
      setSourceTags(data.medias[0]?.tags);
    }
    setSelectedCnt(new Array(data.total_medias).fill(0));
    getKidList(data.school_id, data.class_id);
  };

  const handleClickAllBtn = (flag) => {
    const newMediaArray = mediaArray;
    const newTagList = [];
    if (flag) {
      Object.assign(
        newTagList,
        [],
        kidList.map((kid) => ({
          ...kid,
          class_name: className || "-",
          bbox: [],
          by_user: false,
          id: "",
        }))
      );
    }
    newMediaArray[currentIdx].tags = newTagList;
    setMediaArray(Object.assign([], newMediaArray));
  };
  const handleSelectKid = (e) => {
    e.stopPropagation();
    console.log("selected");
    const tagIdx = e.target.getAttribute("data-tag-idx"); // TODO ????????? ???????
    const item = kidList[tagIdx];

    const curImageTag = mediaArray[currentIdx]?.tags || [];
    const newTagList = [...curImageTag];

    /* check new kid tag */
    const idx = newTagList.findIndex(
      (tagItem) => tagItem.kid_id == item.kid_id
    );

    e.target.parentElement.style.transition = "all ease 1s";
    e.target.parentElement.style.webkitTransition = "all ease 1s";

    const selected = idx < 0;

    // create or remove from tag list
    if (selected) {
      // TODO: ?????? ????????? tag ?????? ?????? ??????
      newTagList.push({
        kid_id: item.kid_id,
        kid_name: item.kid_name,
        class_id: item.class_id,
        class_name: className || "-",
        bbox: [],
        by_user: false,
        id: "",
      });
      //setSelectedCnt(selectedCnt.map((cnt,idx) => (idx === currentIdx ? Number(cnt+1) : cnt)))
    } else {
      newTagList.splice(idx, 1);
      //setSelectedCnt(selectedCnt.map((cnt,idx) => (idx === currentIdx ? Number(cnt-1) : cnt)))
    }

    // e.target.parentNode.setAttribute("selected", selected);
    e.target.parentElement.setAttribute("data-selected", selected);
    const newMediaArray = mediaArray;
    newMediaArray[currentIdx].tags = newTagList;
    setMediaArray(Object.assign([], newMediaArray));
  };

  const setImages = (dataStr) => {
    const data = JSON.parse(dataStr);
    //check data type
    try {
      initDataset(data);
    } catch (error) {
      console.error("[setImage] failed ", error.message);
      alert("????????? ???????????? ?????????????????????.");
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

  const leaveWarnPopup = () => {
    showCancelPopup(false)
  }
  const showWarnPopup = (from) => {
    if(!isErrorPage){
      setCancelPopMsg("?????? ????????? ????????? ????????? ???????????????.\n????????? ???????????? ?????????????????????????")
    }else{
      if(from === 'onBack'){
        setCancelPopMsg("?????? ????????? ????????? ????????? ???????????????.\n????????? ???????????? ?????????????????????????")  
      }else{
        setCancelPopMsg("????????? ?????? ?????? ?????? ?????????\n?????? ???????????? ????????? ??? ??? ????????????.")
      }
      setCancelPopFrom(from)
    }
    showCancelPopup(true);
  };
  const activeConfirmBtn = (newTags) => {
    if (JSON.stringify(sourceTags) !== JSON.stringify(newTags)) {
      editTags(true);
    } else {
      editTags(false);
    }
  };

  return (
    <>
      <AlbumHeader
        onConfirm={handleComplete}
        title={"?????? ??????"}
        activeBtn={!isErrorPage ?  true : isEditTags }
        onBackBtn={() => showWarnPopup(isErrorPage && 'onBack')}
        infoBtn
        backBtnType={backBtnType}
      />
      {mediaArray && mediaArray.length > 0 && (
        <>
          <ViewBox
            mediaArray={mediaArray}
            total={totalMedias}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
          />
          <AlbumTagSelect
            kidList={kidList}
            onClickKid={handleSelectKid}
            imageListData={mediaArray}
            currentIdx={currentIdx}
            onClickAllKid={handleClickAllBtn}
            editMode={false}
            isErrorPage={isErrorPage}
            activeConfirmBtn={activeConfirmBtn}
          />
          <WarnPopup
            show={cancelPopup}
            title={cancelPopMsg}
            onClose={leaveWarnPopup}
            onConfirm={!isErrorPage ? onBack : cancelPopFrom === 'onBack' ? onBack : () => handleComplete(null,true)}
          />
        </>
      )}
    </>
  );
}
