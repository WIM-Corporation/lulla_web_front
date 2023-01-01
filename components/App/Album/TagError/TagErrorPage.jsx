import axios from "axios";
import { Component, useEffect, useRef, useCallback } from "react";
import useState from "react-usestateref";
import { encodeImage } from "@/components/common/Utils";
import { useRouter } from "next/router";
import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import FullCanvas from "@/components/App/Album/TagCanvas/FullCanvas";
import TagArea from "@/components/App/Album/TagCanvas/TagArea";
import CountView from "@/components/App/Album/CountView";
import Image from "next/image";
import TagIcon from "@/assets/imgs/tag_fill.svg";
import qs from "qs";

/* Test Data */
import Loading from "@/components/App/Album/Common/Loading";
import TestBtnCombo, {
  dummyErrorImageData,
} from "@/components/App/Album/Common/Test";
import TagListPopup from "./TagListPopup";
import WarnPopup from "@/components/common/WarnPopup";

export default function TagErrorPage(props) {
  const isWebTestMode = false;
  const router = useRouter();

  const [error, setError, errorRef] = useState(false);
  const [width, setWidth, widthRef] = useState(0);
  const [loading, setLoading, loadingRef] = useState(false);

  const [activeSendBtn, setSendBtnActive, activeSendBtnRef] = useState(false);
  const [imgSrc, setImgSrc, imgSrcRef] = useState(null);

  const [schoolId, setSchoolId, schooldIdRef] = useState("");
  const [classId, setClassId, classIdRef] = useState("total");

  const [totalMedias, setTotalMedias, totalMediasRef] = useState(0);
  const [currentIdx, setCurrentIdx, currentIdxRef] = useState(0);
  const [img, setImg, imgRef] = useState(null);
  const [tags, setTags, tagsRef] = useState(null);

  const imgAreaBox = useRef(null);
  const delayRef = useRef(null);
  const authDataRef = useRef(null);

  // pop up
  const [cancelPopup, showCancelPopup, cancelPopupRef] = useState(false);
  const [tagListPopup, showTagList, tagListPopupRef] = useState(false);
  const [deviceType, setDeviceType, deviceTypeRef] = useState(null);

  const getDeviceType = () => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const dtype = query?.type;
    console.log("device type :", dtype);
    setDeviceType(dtype);
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

        // kid_list to map
        const kid_map = kid_list.reduce((m, kid) => {
          m[kid.kid_id] = kid;
          return m;
        }, {});

        // tag update
        const updatedTags = tagsRef.current?.map((tag) => {
          tag.kid_thumb_url = kid_map[tag.kid_id]?.kid_thumb_url;
          tag.class_name = class_name;
          return tag;
        });
        console.log("updatedTags", updatedTags);

        setTags(updatedTags);
      })
      .catch((err) => {
        console.error("[getKidList] Failed : ", err);
        alert("통신에 문제가 발생하였습니다.");
      });
  }

  /* 완료 button onClick function */
  async function sendError() {
    /* TODO: check api in output */
    /* TO CHECK: useCallback? */
    /* TODO: Error Handling 필요 => flow & view check (alert?) */

    // axios({
    //   method: "post",
    //   url: "/api/v1/album/error",
    //   headers: {
    //     Authorization: "Bearer " + data.token,
    //   },
    //   data: {
    //     member_id: "0dddcb4e-9162-11ec-821f-0af154999872",
    //     tag_error_id: "a193400e-db3a-11ec-825f-0af154999872",
    //   },
    // }).then(({data: respData}) => {
    //   console.log(respData);
    //   // 로딩 끝내고
    //   // setTagComplete(true);
    //   // setTags(respData.result);
    //   // setLoading(false);
    // }).catch((err) => {
    //   // setLoading(false);
    //   console.log(err.message);
    //   alert("서버와 통신중 오류가 발생하였습니다.");
    //   // TODO 이거도 그냥 얼굴 인식 못한 플로우로 처리하기
    // });
    alert("보내기 API를 연결하세요.");
    return false;
  }

  /* Parsing dataStr input from native => set & render image, tags */
  const setImage = (dataStr) => {
    console.log("setImage", dataStr);
    setTags(null);
    setImg(new window.Image());
    const data = JSON.parse(dataStr);

    /* Check data invalid */
    if (typeof data.school_id === undefined) {
      alert("유치원 정보가 필요합니다.");
      return;
    }
    if (typeof data.media === undefined || typeof data.media != "object") {
      alert("이미지 정보가 필요합니다.");
      return;
    }
    if (
      typeof data.total_medias === undefined ||
      typeof data.media.seq === undefined
    ) {
      alert("몇번째 사진인지 정보가 필요합니다.");
      return;
    }

    setSchoolId(data.school_id);
    setClassId(data.class_id);

    setTotalMedias(data.total_medias);
    setCurrentIdx(data.media.seq);

    /* Draw a image */
    const imageSrc = data?.media?.image_url;
    if (imageSrc) {
      setImgSrc(imageSrc);
      setTags(data.media.tags);
    } else {
      alert("이미지 인식에 실패하였습니다.");
    }

    initKidData(data);
  };

  const initKidData = (data) => {
    if (deviceTypeRef.current == "android") {
      window.app.getAuthData();
    } else if (deviceTypeRef.current == "ios") {
      window.webkit.messageHandlers.getAuthData.postMessage("");
    } else {
      authDataRef.current = {
        token: isWebTestMode ? "test" : null,
        memberId: isWebTestMode ? "test" : null,
      };
    }

    delayRef.current = setInterval(async () => {
      if (authDataRef.current.token) {
        clearInterval(delayRef.current);
        getKidList(data.school_id, data.class_id);
      }
    }, 500);
  };

  /* initialize */
  useEffect(() => {
    // init
    getDeviceType();
    if (deviceTypeRef.current == "ios") {
      window.webkit.messageHandlers.pageLoaded.postMessage("");
    } else if (deviceTypeRef.current == "android") {
      window.app.pageLoaded();
    } else {
      alert("[페이지 초기화] 이 기능은 앱에서 정상 작동 합니다.");
    }

    window.receiveAuthData = function (token, memberId) {
      authDataRef.current = {
        token,
        memberId,
      };
    };

    setTags(null);
    setError(false);
    setImg(new window.Image());
    if (window) {
      window.setImage = setImage;
    }

    const resize = () => {
      setWidth(window.outerWidth);
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* header events */
  const handleBackPress = (e) => {
    if (!deviceTypeRef.current) {
      getDeviceType();
    }

    if (deviceTypeRef.current == "android") {
      window.app.cancel();
    } else if (deviceTypeRef.current == "ios") {
      window.webkit.messageHandlers.cancel.postMessage("");
    } else {
      alert("[뒤로가기] 이 기능은 앱에서만 동작합니다.");
    }
  };

  const handleComplete = (e) => {
    sendError().then((result) => {
      // exit webview if an error request is successfully sent.
      if (result) {
        handleBackPress();
      }
    });
  };

  /* keyup */
  const textRef = useRef();
  const checkKeyInput = useCallback(() => {
    console.log("textRef.current.scrollHeight", textRef.current.scrollHeight);
    textRef.current.style.height =
      (Number(textRef.current.scrollHeight) + 1).toString() + "px";

    const maxByte = 5000;
    const text = textRef.current.value;
    let totalByte = 0;
    for (let i = 0; i < text.length; i++) {
      const each_char = text.charAt(i);
      const uni_char = escape(each_char); //유니코드 형식으로 변환
      if (uni_char.length > 4) {
        totalByte += 2;
      } else {
        totalByte += 1;
      }
    }
    if (totalByte > 0) {
      setSendBtnActive(true);
    } else {
      setSendBtnActive(false);
    }

    if (totalByte > maxByte) {
      alert("최대 5000Byte까지만 입력가능합니다.");
    }
  }, []);

  return (
    <>
      {isWebTestMode && (
        <TestBtnCombo testData={dummyErrorImageData} onClick={setImage} />
      )}
      <div className="Wrap">
        <main>
          <AlbumHeader
            onBackBtn={(e) => {
              showCancelPopup(true);
            }}
            onConfirm={handleComplete}
            title={"태그 오류 보내기"}
            activeBtn={activeSendBtn}
            backBtnType={"x"}
          />
          <div ref={imgAreaBox} className="view_box">
            <FullCanvas loading={loading} img={img} imgSrc={imgSrc} resizing />
            {loading ? <Loading /> : null}
            <TagArea
              tagType={"bubble"}
              tags={tags}
              img={img}
              imgAreaBox={imgAreaBox}
            />
            {totalMedias > 0 && (
              <>
                <CountView current={1 + currentIdx} total={totalMedias} />
                <div className="tag_info" onClick={() => showTagList(true)}>
                  <Image src={TagIcon} />
                </div>
              </>
            )}
          </div>
          <div className="write_box">
            <textarea
              ref={textRef}
              className="text_area"
              rows={1}
              placeholder="오류 사항을 입력하세요"
              onInput={checkKeyInput}
              onBlur={() => {
                document.getElementsByClassName("Wrap")[0].scrollIntoView();
              }}
            ></textarea>
          </div>
          <div
            className={`overlay ${tagListPopup ? "show" : ""}`}
            onClick={() => showTagList(false)}
          />
          <div className={`tag_list ${tagListPopup ? "show" : ""}`}>
            <TagListPopup tags={tags} />
          </div>
        </main>
        {WarnPopup(
          cancelPopup,
          `작성 중인 내용이 삭제됩니다.
           태그 오류 보내기 작성을 그만 하시겠습니까?`,
          () => {
            showCancelPopup(false);
          },
          handleBackPress
        )}
      </div>
    </>
  );
}
