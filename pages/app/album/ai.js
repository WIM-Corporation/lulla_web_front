import axios from "axios";
import { useEffect, useCallback, useRef } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/router";

import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import Alert from "@/components/common/Alert";
import FullCanvas from "@/components/App/Album/TagCanvas/FullCanvas";
import AITagView from "@/components/App/Album/AITagView";
import CountView from "@/components/App/Album/CountView";
import TagArea from "@/components/App/Album/TagCanvas/TagArea";
import Loading from "@/components/App/Album/Common/Loading";
import EditorView from "@/components/App/Album/TagEdit/EditorView";
import { encodeImage } from "@/components/common/Utils";
import WarnPopup from "@/components/common/WarnPopup";
import SimplePopup from "@/components/common/SimplePopup";
import TestBtnCombo, {
  dummyAITagResponse,
  dummyFromNativeData,
  dummyKidList,
} from "@/components/App/Album/Common/Test";

function Album() {
  const router = useRouter();
  const isWebTestMode = false;
  const imgAreaBox = useRef(null);

  const [kidList, setKidList, kidListRef] = useState([]);
  const [img, setImg, imgRef] = useState(null);
  const [imgSrc, setImgSrc, imgSrcRef] = useState(null);
  const [loading, setLoading, loadingRef] = useState(false);
  const [error, setError, errorRef] = useState(false);
  const [tags, setTags, tagsRef] = useState([]);
  const [isVideo, setIsVideo, isVideoRef] = useState(false);
  const [width, setWidth, widthRef] = useState(0);

  const [isTagComplete, setTagComplete, isTagCompleteRef] = useState(false);

  const [schoolId, setSchoolId, schoolIdRef] = useState(null);
  const [classId, setClassId, classIdRef] = useState(null);
  const [className, setClassName, classNameRef] = useState(null);
  const [totalMedias, setTotalMedias, totalMediasRef] = useState(null);
  const [currentIdx, setCurrentIdx, currentIdxRef] = useState(-1);
  const [imageArray, setImageArray, imageArrayRef] = useState([]);
  const [deletedMediasSeq, setDeletedMediasSeq, deletedMediasSeqRef] = useState(
    []
  );

  // edit Mode
  const [isEditMode, setEditMode, isEditModeRef] = useState(false);
  const [initEditKid, setInitEditKid, initEditKidRef] = useState(null);

  const [mediaType, setMediaType, mediaTypeRef] = useState(null);

  // const [returnData, setReturnData] = useState([]); // window.appReturnData 로 이동

  // long touch for showing remove page
  const touchTimerRef = useRef({
    now: null,
    timerId: null,
    interval: 10,
    triggerTime: 2500,
  });

  const [drawTag, setDrawTag, drawTagRef] = useState(false);

  //popup
  const [cancelPopup, showCancelPopup, cancelPopupRef] = useState(false);
  const [deletePopup, setDeletePopup, deletePopupRef] = useState(false);

  //auth
  const authDataRef = useRef(null);
  const delayRef = useRef(null);
  const actionLog = useRef(null);
  const onLoadFlag = useRef(null);

  /* EditMode (수동태그) */
  const onTagAreaClick = useCallback((e) => {
    if (isVideo) {
      e.currentTarget.style.display = "none";
      return;
    }
    if (
      e.target.classList.contains("tag_area") &&
      !e.target.classList.contains("tag_line") &&
      !isEditMode
    ) {
      const boxSize = 150; // default
      const centerX = e.nativeEvent.offsetX;
      const centerY = e.nativeEvent.offsetY;
      const left = centerX - boxSize / 2;
      const right = centerX + boxSize / 2;
      const top = centerY - boxSize / 2;
      const bottom = centerY + boxSize / 2;
      let initKid = {
        kid_id: null,
        kid_name: null,
        class_id: classId,
        class_name: className,
        bbox: [left, top, right, bottom],
        by_user: true,
      };

      setInitEditKid(initKid);
      //      setImgSrc(null);
      setDrawTag(false);
      setEditMode(true);
      actionLog.current = "editMode";
    } else if (e.target.classList.contains("tag_line") && !isEditMode) {
      if (e.target.parentNode.querySelector(".tag_name").hidden) {
        //go to edit
        let i = e.target.getAttribute("data-tag-idx");
        if (i) {
          i = parseInt(i);
          handleTagDelClick(tags[i], i);
        }
      }
    }
  });

  function startAiProc(
    school_id,
    class_id,
    class_name,
    image_string,
    img_org,
    kid_list,
    curIdx
  ) {
    setTags(null);
    setLoading(true);

    if (img_org.tags?.length > 0 || img_org.isTagged) {
      setTagComplete(true);
      setTags(img_org.tags);
      setLoading(false);
      return;
    }

    //    alert("현재 테스트를 위해 class id 가 고정되어있습니다.");
    let resTag = [];
    axios({
      method: "post",
      url: "/api/v1/ai/predict_v1_image_data",
      data: JSON.stringify({
        school_id: school_id,
        class_id: class_id,
        image_string: image_string,
      }),
      headers: {
        Authorization: `Bearer ${authDataRef.current.token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then(({ data: respData }) => {
        // 로딩 끝내고
        // refactoring
        console.log("[startAiProc] predict_v1_image_data result :", respData);
        if (respData.resultCode != 1) {
          console.error(
            "[startAiProc] Failed : " +
              "(" +
              respData.resultCode +
              ")" +
              respData.message
          );
          alert("이미지 인식에 실패하였습니다.");
          resTag = [];

          if (isWebTestMode) {
            dummyAITagResponse.data.tags.map((tag, i) => {
              tag.kid_name =
                kid_list.find((v) => v.kid_id == tag.kid_id)?.kid_name || "";
              tag.class_name = class_name;
            });
            resTag = dummyAITagResponse.data.tags;
          }
        }

        resTag = respData?.data?.tags || resTag;

        setTagComplete(true);
        resTag.map((tag, i) => {
          tag.kid_name =
            kid_list.find((v) => v.kid_id == tag.kid_id)?.kid_name || "";
          tag.class_name = class_name;
        });
        setImageArray(
          Object.assign(
            [],
            imageArrayRef.current.map((imgObj, i) => {
              return i === curIdx ? { ...imgObj, tags: resTag } : imgObj;
            })
          )
        );
        setTags(resTag);
        setLoading(false);
        actionLog.current = "aiTagging";
      })
      .catch((err) => {
        console.log("[startAiProc] Catch error : " + err.message);
        // alert("통신에 문제가 발생하였습니다.\n" + err.message);
        setTags([]);

        if (isWebTestMode) {
          dummyAITagResponse.data.tags.map((tag, i) => {
            tag.kid_name =
              kid_list.find((v) => v.kid_id == tag.kid_id)?.kid_name || "";
            tag.class_name = class_name;
          });
          resTag = dummyAITagResponse.data.tags;
          setTags(resTag);
        }

        setLoading(false);
        setTagComplete(true);
        actionLog.current = "aiTagging";
      });
  }
  const parseToReturnData = (data) => {
    return data.map((imgObj) =>
      imgObj?.mime_type?.startsWith("video")
        ? {
            mime_type: imgObj.mime_type || null,
            seq: imgObj.seq, // setImage 호출했을때 seq번호
            video_path: imgObj.video_path || null,
            width: imgObj.width || -1,
            height: imgObj.height || -1,
            duration: imgObj.duration || [], // 빈배열로 시작
            isTagged: imgObj.isTagged || true,
          }
        : {
            mime_type: imgObj.mime_type || null,
            seq: imgObj.seq, // setImage 호출했을때 seq번호
            data: imgObj.data || null,
            width: imgObj.width || -1,
            height: imgObj.height || -1,
            tags: imgObj.tags || [], // 빈배열로 시작
            isTagged: imgObj.isTagged || false,
          }
    );
  };

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

  // 초기화 세팅
  const initDataset = (data) => {
    setSchoolId(data.school_id);
    leaveEditMode();
    setTotalMedias(data.total_medias);

    if (!data.class_id) {
      alert(
        "원장님 프로필은 태그기능을 지원하지 않습니다\n선생님 프로필로 시도해주세요?"
      );
      handleBackPress();
    }

    setClassId(data.class_id || "");
    setCurrentIdx(0);
    console.log("[initDataset] Data : ", data);
    setImageArray(parseToReturnData(data.medias));
    window.appReturnData = [];
    onLoadFlag.current = true;
    let src = null;

    try {
      if (
        data.medias[0].mime_type &&
        data.medias[0].mime_type.startsWith("video")
      ) {
        src = data.medias[0].video_path;
        alert("비디오 타입은 현재 지원하지 않습니다.");
        setImgSrc(src);
        setMediaType(data.medias[0].mime_type);
        setIsVideo(true);
      } else {
        setIsVideo(false);
        setMediaType(null);
        setImgSrc(parseImageSrc(data.medias[0]));
        // 세팅 된 상태에서 로딩 프로그래스 돌면서 AI 서버와 통신
        const dataClassId = data.class_id;
        if (DEVICE_TYPE == "android") {
          window.app.getAuthData();
        } else if (DEVICE_TYPE == "ios") {
          window.webkit.messageHandlers.getAuthData.postMessage("");
        } else {
          // window.app.getAuthData();
          authDataRef.current = {
            token: isWebTestMode ? "test" : null,
            memberId: isWebTestMode ? "test" : null,
          };
        }

        delayRef.current = setInterval(async () => {
          if (authDataRef.current.token) {
            clearInterval(delayRef.current);
            getKidList(data.school_id, data.class_id).then((kid_info) => {
              startAiProc(
                data.school_id,
                data.class_id,
                kid_info?.class_name,
                data.medias[0].data,
                data.medias[0],
                kid_info?.kid_list,
                currentIdxRef.current
              );
              let newImageArray = imageArrayRef.current;
              newImageArray[0].isTagged = true;
              checkAllTagged(newImageArray);
              setImageArray(Object.assign([], newImageArray));
            }); //
          }
        }, 500);
      }
    } catch (err) {
      console.error("[initDataset] Failed getKidList : ", err);
      setError("이미지 데이터를 해석하지 못했습니다.");
      alert("이미지 데이터를 해석하지 못하였습니다. ");
      return;
    }

    /* 원본 이미지 구하기 */
    for (let i = 0; i < imageArray.length; i++) {
      let img = new window.Image();
      img.onload = function () {
        window.appReturnData[i].width = img.width;
        window.appReturnData[i].height = img.width;
        img = null;
      };
      // img.src = encodeImage(imageArray[i].data);
    }
  };

  async function getKidList(school_id, class_id) {
    let class_name = null;
    let kid_list = [];
    await axios({
      method: "post",
      headers: { "Content-Type": `application/json` },
      url: "/api/v1/kid/list/class",
      data: { school_id, class_id },
    })
      .then(({ data: res }) => {
        console.log("[getKidList] kid/list/class Data : ", res);

        if (res.resultCode != 1) {
          throw new Error(
            "원아 목록을 가져오는데 실패하였습니다. \n" +
              res.message +
              "(" +
              res.resultCode +
              ")"
          );
        }

        class_name = res?.data?.class_name;
        if (!class_name) {
          throw new Error("Class 정보가 없습니다.");
        }

        kid_list = res?.data?.kid_list;
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
        if (isWebTestMode) {
          const res = dummyKidList;
          console.log("[getKidList] Get fake data");
          setClassName(res?.data?.class_name);
          setKidList(res?.data?.kid_list);
        }
      });
    return { class_name, kid_list };
  }

  //useEffect[]
  useEffect(() => {
    //    setTags(null);
    setError(false);
    setImg(new window.Image());
    if (window) {
      function setImages(dataStr) {
        try {
          const data = JSON.parse(dataStr);

          // 유효성 체크
          if (typeof data.school_id === undefined) {
            console.error("[useEffect:[]] school_id is not existed");
            throw new Error("유치원 정보가 존재하지 않습니다");
          }
          if (
            typeof data.medias === undefined ||
            typeof data.medias != "object"
          ) {
            console.error("[useEffect:[]] medias is not existed");
            throw new Error("잘못된 이미지 형식입니다");
          }
          const imgCount = data.medias.length;
          if (imgCount < 1) {
            console.error("[useEffect:[]] image size is 0.");
            throw new Error("이미지가 없습니다");
          }

          for (const imgObj of data.medias) {
            // 객체 형식 {"seq": 0, "data": "base64로 인코딩된 이미지"},
            if (typeof imgObj.seq === undefined) {
              console.error("[useEffect:[]] image seq is undefined.");
              throw new Error("이미지 시퀀스 정보가 없습니다");
            }
          }
          initDataset(data);
        } catch (err) {
          console.error("[useEffect:[]] " + err.message);
          alert("이미지 초기화에 실패하였습니다.");
          return;
        }
      }

      window.setImages = setImages;
    }
    // check width
    const resize = () => {
      setWidth(window.outerWidth);
    };
    window.addEventListener("resize", resize);
    resize();

    window.backKey = function () {
      switch (actionLog.current) {
        case "aiTagging":
          showCancelPop();
          break;
        case "cancelPopup":
          leaveWarnPopup();
          break;
        case "deletePopup":
          leaveDeletePopup();
          break;
        case "editMode":
          leaveEditMode(imageArray[currentIdx]);
          break;
        default:
          window.app.cancel();
          break;
      }
    };
    window.receiveAuthData = function (token, memberId) {
      authDataRef.current = {
        token,
        memberId,
      };
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.backKey = null;
    };
  }, []);

  // tags 값 변경 감지 전용 effect hook == window.appReturnData 업데이트용
  useEffect(() => {
    if (Array.isArray(tags) && imageArray.length > 0) {
      console.log("[useEffect] Tags", tags, "CurrentIdx ", currentIdx);
      let newImageArray = imageArray;
      for (let i = 0; i < tags.length; i++) {
        const newTag = {
          kid_id: tags[i].kid_id,
          kid_name: tags[i].kid_name || "",
          class_id: tags[i].class_id || classId,
          class_name: tags[i].class_name || className,
          bbox: tags[i].bbox || [],
          by_user: tags[i].by_user || false,
        };
        if (newImageArray[currentIdx].tags[i].kid_id) {
          const findIndex = newImageArray[currentIdx].tags.findIndex(
            (ti) => ti && ti.kid_id == tags[i].kid_id
          );
          if (findIndex < 0) {
            // kid_id로 중복 체크
            newImageArray[currentIdx].tags.push(newTag);
          } else {
            newImageArray[currentIdx].tags[findIndex] = newTag; // 덮어씌움
          }
        }
        newImageArray[currentIdx].isTagged = true;
      }
      //check completed
      //refactoring need
      setTagComplete(true);
      checkAllTagged(newImageArray);
      setImageArray(Object.assign([], newImageArray));
    }
  }, [tags]);

  /* Header Events */
  const handleBackPress = (e) => {
    if (DEVICE_TYPE == "android") {
      window.app.cancel();
    } else if (DEVICE_TYPE == "ios") {
      window.webkit.messageHandlers.cancel.postMessage("");
    } else {
      alert("이 기능은 앱에서만 동작합니다.");
    }
  };
  const handleComplete = (e) => {
    let finalImageArray = imageArray;
    finalImageArray = finalImageArray.map((image) => {
      image.tags = image.tags.map((tag) => {
        tag.bbox = tag.bbox.map((b) => parseInt(b));
        return tag;
      });
      return image;
    });
    const resultJsonStr = JSON.stringify({
      school_id: schoolId,
      class_id: classId,
      total_medias: totalMedias,
      medias: finalImageArray,
      deleted_medias_seq: deletedMediasSeq,
    });

    console.log("[handleComplete] 완료 : ", resultJsonStr);
    if (DEVICE_TYPE == "android") {
      window.app.complete(resultJsonStr);
    } else if (DEVICE_TYPE == "ios") {
      window.webkit.messageHandlers.complete.postMessage(resultJsonStr);
    } else {
      alert("이 기능은 앱에서만 동작합니다." + resultJsonStr);
    }
  };

  /* Swipe Events for view box */
  let touchstartX = 0;
  let touchendX = 0;

  const setTouchStart = (e) => {
    if (!isEditMode && !loading && img && imgSrc) {
      touchstartX = e.changedTouches[0].screenX; //image swipe

      touchTimerRef.current.timerId = setInterval(() => {
        e.preventDefault();
        //long touch
        if (touchTimerRef.current.now > touchTimerRef.current.triggerTime) {
          setDeletePopup(true);
          touchTimerRef.current.now = 0;
          clearInterval(touchTimerRef.current.timerId);
          actionLog.current = "deletePopup";
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
          return changeImg(currentIdx + 1);
        }
        alert("다음 이미지가 없습니다.");
      } else if (touchendX > touchstartX && touchendX - touchstartX > 150) {
        if (currentIdx > 0) {
          return changeImg(currentIdx - 1);
        }
        alert("이전 이미지가 없습니다.");
      }
    }
  };

  function checkAllTagged(newImageArray) {
    let allTagged = true;
    newImageArray.map((i) => {
      if (
        i.isTagged == false &&
        !(i.mime_type && i.mime_type.startsWith("video"))
      ) {
        allTagged = false;
      }
    });
    setTagComplete(allTagged);
  }

  function changeImg(index) {
    setDrawTag(false);
    setTags([]);
    setImg(new window.Image());
    let src = null;

    if (
      imageArrayRef.current[index].mime_type &&
      imageArrayRef.current[index].mime_type.startsWith("video")
    ) {
      src = imageArrayRef.current[index].video_path;
      setImgSrc(src);
      setCurrentIdx(index);
      setIsVideo(true);
      setMediaType(imageArrayRef.current[index].mime_type);
      setTags([]);
    } else {
      setImgSrc(parseImageSrc(imageArrayRef.current[index]));
      setCurrentIdx(index);
      setIsVideo(false);
      setMediaType(null);
      startAiProc(
        schoolId,
        classId,
        className,
        imageArrayRef.current[index].data,
        imageArrayRef.current[index],
        kidList,
        index
      );

      // isTagged
      let newImageArray = imageArray;
      newImageArray[index].isTagged = true;
      checkAllTagged(newImageArray);
      setImageArray(Object.assign([], newImageArray));

      setTags(imageArrayRef.current[index].tags);
    }
  }

  /* AITagView Events */
  const handleTagClick = useCallback(
    (selected) => {
      // kid 수정
      console.log("Kid Click");
      const tagNames = imgAreaBox.current.querySelectorAll(".tag_name");
      tagNames.forEach((tag, i) => {
        if (tag.getAttribute("kid_id") == selected.kid_id) {
          tag.setAttribute("data-selected", true);
        } else {
          tag.setAttribute("data-selected", false);
        }
      });
    },
    [tags]
  );

  const handleTagDelClick = useCallback(
    (selected, idx) => {
      // kid 수정
      let newImage = imageArray;
      let newTag = selected.kid_id
        ? tags.filter((v) => v.kid_id !== selected.kid_id)
        : tags.filter((v, i) => i !== idx);
      newImage[currentIdx].tags = newTag;

      setImageArray(newImage);
      setTags(newTag);
      setInitEditKid(selected);
      setImgSrc(null);
      setDrawTag(false);
      setEditMode(true);
    },
    [tags]
  );

  const onPauseEvent = (e) => {
    imgAreaBox.current.querySelector(".tag_area").style.display = "block";
  };

  const leaveWarnPopup = (e) => {
    showCancelPopup(false);
    actionLog.current = "aiTagging";
  };

  const showCancelPop = () => {
    showCancelPopup(true);
    actionLog.current = "cancelPopup";
  };

  const leaveDeletePopup = () => {
    clearInterval(touchTimerRef.current.timerId);
    setDeletePopup(false);
    actionLog.current = "aiTagging";
  };

  const leaveEditMode = (e) => {
    console.log(
      "[leaveEditMode] Close Edit Mode (" + e ? "complete)" : "cancel)"
    );
    setEditMode(false);
    actionLog.current = "aiTagging";
    if (e) {
      setImg(new window.Image());
      setImgSrc(parseImageSrc(e));
    }
  };

  const onImageLoadEvent = (e) => {
    console.log("[onImageLoadEvent] Image Load is completed");
    setDrawTag(true);
  };

  const deleteCurrentImg = () => {
    console.log("[deleteCurrentImg] Delete image (index:" + currentIdx + ")");
    if (imageArray.length == 1) {
      alert("마지막 이미지는 삭제할 수 없습니다.");
      leaveDeletePopup();
      return;
    }

    setDeletedMediasSeq(deletedMediasSeq.concat(imageArray[currentIdx].seq));
    const newData = imageArray.filter((image, idx) => idx !== currentIdx);
    let newIdx = currentIdx > 0 ? currentIdx - 1 : 0;
    setTotalMedias(newData.length);
    setImageArray(newData);
    changeImg(newIdx);
    leaveDeletePopup();
  };

  return (
    <div
      style={{
        maxHeight: "100%",
        overflowY: "hidden",
        height: "100%",
      }}
    >
      {isWebTestMode && (
        <TestBtnCombo
          testData={dummyFromNativeData}
          onClick={initDataset}
          jsonData
        />
      )}
      {onLoadFlag.current && (
        <>
          {isEditMode ? (
            <EditorView
              initKid={initEditKid}
              initClassName={className}
              kidList={kidList}
              editImage={imageArray[currentIdx]}
              editOnCancel={() => {
                leaveEditMode(imageArray[currentIdx]);
              }}
              editOnComplete={(curImage) => {
                // kid 수정
                let newImage = imageArray;
                newImage[currentIdx].tags = curImage.tags;
                setImageArray(newImage);
                setTags(curImage.tags);
                leaveEditMode(newImage[currentIdx]);
              }}
            />
          ) : null}
          <div className="Wrap">
            <main>
              <AlbumHeader
                onConfirm={handleComplete}
                title={"태그 하기"}
                activeBtn={isTagComplete}
                onBackBtn={(e) => {
                  showCancelPop();
                }}
                infoBtn={true}
              />
              <div
                ref={imgAreaBox}
                className="view_box"
                onTouchStart={setTouchStart}
                onTouchEnd={setTouchEnd}
                onClickCapture={onTagAreaClick}
              >
                {imageArray.length > 0 && (
                  <FullCanvas
                    loading={loading}
                    isVideo={isVideo}
                    img={img}
                    imgSrc={imgSrc}
                    onLoad={onImageLoadEvent}
                    onPause={onPauseEvent}
                    mediaType={mediaType}
                    resizing
                  />
                )}
                {loading ? (
                  <Loading />
                ) : (
                  !error &&
                  tags && (
                    <>
                      <Alert message={"인식이 완료되었습니다."} />
                      {imageArray.length > 0 && (
                        <CountView
                          current={1 + currentIdx}
                          total={imageArray.length}
                        />
                      )}
                      {drawTag ? (
                        <TagArea
                          tags={tagsRef.current}
                          img={img}
                          imgAreaBox={imgAreaBox}
                          onClick={onTagAreaClick}
                        />
                      ) : null}
                    </>
                  )
                )}

                <AITagView
                  tags={tags}
                  handleTagClick={handleTagClick}
                  handleTagDelClick={handleTagDelClick}
                  imgSrc={imgSrc}
                />
              </div>

              <WarnPopup
                show={cancelPopup}
                title={"모든 사진에 태그된 정보가 사라집니다"}
                onClose={leaveWarnPopup}
                onConfirm={handleBackPress}
              />
              {SimplePopup(deletePopup, leaveDeletePopup, deleteCurrentImg)}
            </main>
          </div>
          )
          <style jsx>
            {`
              .tag_area ~ * {
                filter: grayscale(50%) blur(5px);
              }
            `}
          </style>
        </>
      )}
    </div>
  );
}

export default function AlbumContainer() {
  const [ready, setReady, readyRef] = useState(false);
  const urlRef = useRef(null);
  const getType = () => {
    var a = window.location.search.substr(1).split("&");
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split("=", 2);
      if (p.length == 1) b[p[0]] = "";
      else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b.type;
  };

  const getDeviceType = () => {
    urlRef.current = setInterval(() => {
      if (getType()) {
        setReady(true);
        if (getType() == "ios") {
          window.DEVICE_TYPE = "ios";
          window.webkit.messageHandlers.pageLoaded.postMessage("");
        } else if (getType() == "android") {
          window.DEVICE_TYPE = "android";
          window.app.pageLoaded();
        } else {
          window.DEVICE_TYPE = "web";
          console.error("이기능은 앱에서 정상작동합니다.");
        }
        clearInterval(urlRef.current);
      }
    }, 300);
  };

  if (!ready && !urlRef.current) {
    getDeviceType();
    return null;
  } else {
    return <Album />;
  }
}
