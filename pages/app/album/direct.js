import axios from "axios";
import { Component, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";

import infoIcon from "@/assets/icons/info-fill-gray-24.svg";
import leftArrow from "@/assets/imgs/left.png";
import xBtn1 from "@/assets/imgs/x_btn.png";
import AlbumTagSelect from "@/components/App/AlbumTagSelect";

import testImageData1 from "@/assets/test/eximg3";
import testImageData2 from "@/assets/test/eximg1";
import testImageData3 from "@/assets/test/eximg2";

function Album() {
  const isWebTestMode = false; // 웹에서 테스트 하는 경우만 사용
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [imgSrc, setImgSrc] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [schoolId, setSchoolId] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [returnData, setReturnData] = useState([]);
  // 컴포넌트로 빼기
  const [classList, setClassList] = useState([]);
  const [kidList, setKidList] = useState([]);
  const [selectClass, setSelectClass] = useState("");
  // const [selectKidList, setSelectKidList] = useState([]);

  // const isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
  let deviceType = "web";
  if (router.query && router.query.type) {
    if (router.query.type == "ios") deviceType = "ios";
    if (router.query.type == "android") deviceType = "android";
  }
  // else {
  //   if (navigator.userAgent.match(/iPhone|iPad|iPod/i) != null) {
  //     deviceType = "ios";
  //   } else
  //   if (navigator.userAgent.match(/Android/i) != null) {
  //     deviceType = "android";
  //   }
  // }

  useEffect(() => {
    if (!isMounted) {
      /* 주: window에 function 바인딩 해둬야 모바일 앱에서 불러 쓸수 있음! */
      function setImages(dataStr) {
        console.log(dataStr);
        // alert(dataStr);
        // 요청 데이처 형식은 = {
        //   "school_id": "원ID",
        //   "class_id": "반ID", // 선생님일때 option
        //   "images": [
        //     {"seq": 0, "data": "base64로 인코딩된 이미지"},
        //     {"seq": 1, "data": "base64로 인코딩된 이미지"},
        //     ... // 선택된 갯수만큼 반복
        //   ]
        // }
        const data = JSON.parse(dataStr);
        // console.log(data);
        // 유효성 검사
        {
          if (typeof data.school_id === undefined) {
            alert("school_id 없음!");
            return;
          }
          if (
            typeof data.images === undefined ||
            typeof data.images != "object"
          ) {
            alert("images 없음!");
            return;
          }
          try {
            const imgCount = data.images.length;
            if (imgCount < 1) {
              alert("image가 1개 이상 필요");
              return;
            }
          } catch (error) {
            alert("images 없음!");
            return;
          }
          for (const imgObj of data.images) {
            // 객체 형식 {"seq": 0, "data": "base64로 인코딩된 이미지"},
            if (typeof imgObj.seq === undefined) {
              alert("imgObj에 seq 없음");
              return;
            }
            if (typeof imgObj.data === undefined) {
              alert("imgObj에 data 없음");
              return;
            }
          }
        }
        // 초기화 세팅
        setImageArray(data.images);
        setCurrentIdx(0);
        window.appReturnData = [];
        let rData = [];
        for (const imgObj of data.images) {
          rData.push({
            seq: imgObj.seq, // setImage 호출했을때 seq번호
            width: -1,
            height: -1, // TODO 사이즈를 구할 수 있나??
            tags: [], // 빈배열로 시작
          });
          window.appReturnData.push({
            seq: imgObj.seq, // setImage 호출했을때 seq번호
            width: -1,
            height: -1, // TODO 사이즈를 구할 수 있나??
            tags: [], // 빈배열로 시작
          });
        }
        setReturnData(rData);

        try {
          const imageBase64Data = data.images[0].data;
          // 이미지를 화면에 표시
          setImgSrc(imageBase64Data.replace(/\n/g, "").replace(/\s*/g, ""));
        } catch (error) {
          console.log(error);
          setError(
            "이미지 데이터를 해석하지 못했습니다.\n\n" + imageBase64Data
          );
          return;
        }

        if (schoolId != data.school_id) {
          // 원이 변경되었을 경우
          setSchoolId(data.school_id);
          axios({
            method: "post",
            headers: { "Content-Type": `application/json` },
            url: "https://web.lulla.co.kr/api/v1/kid/list/class",
            data: { school_id: data.school_id },
          })
            .then((resp) => {
              // console.log(resp);
              setClassList(resp.data.data.class_list);
              setKidList(resp.data.data.kid_list);
              setSelectClass(resp.data.data.class_list[0].id);
            })
            .catch((err) => {
              console.error(err);
              alert("통신에 문제가 발생하였습니다.\n" + err.message);
            });
        }
        setIsLoaded(true);

        for (let idx = 0; idx < data.images.length; idx++) {
          let tempImgObj = new window.Image(); // 뭔가 아까워어...
          tempImgObj.onload = function () {
            // 이미지가 로딩 되면
            // console.log(tempImgObj.width, tempImgObj.height);
            window.appReturnData[idx].width = tempImgObj.width;
            window.appReturnData[idx].height = tempImgObj.height;
            tempImgObj = null;
            // console.log(window.appReturnData);
          };
          tempImgObj.src = "data:image/*;base64," + data.images[idx].data;
        }
      }

      // 클라이언트에서만 window가 존재
      if (window) {
        window.setImages = setImages;
      }

      // setIsMounted(true);
    }
  }, []);

  /* 뒤로가기 */
  const handleBackPress = (e) => {
    if (deviceType == "android") {
      window.app.cancel();
    } else if (deviceType == "ios") {
      window.webkit.messageHandlers.cancel.postMessage("");
    } else {
      alert("이 기능은 앱에서만 동작합니다.");
    }
  };
  /* 완료 눌렀을 때 */
  const handleComplete = (e) => {
    for (let i = 0; i < window.appReturnData.length; i++) {
      window.appReturnData[i].tags = returnData[i].tags;
    }
    const resultJsonStr = JSON.stringify({ images: window.appReturnData });
    if (deviceType == "android") {
      window.app.complete(resultJsonStr);
    } else if (deviceType == "ios") {
      window.webkit.messageHandlers.complete.postMessage(resultJsonStr);
    } else {
      alert("이 기능은 앱에서만 동작합니다." + resultJsonStr);
    }
  };

  const handleTestBtn = (e) => {
    const exampleData = {
      school_id: "57c040b0-2fed-11ec-819b-0242ac110003",
      // "class_id": "반ID", // 선생님일때 option
      images: [
        { seq: 0, data: testImageData1 },
        { seq: 1, data: testImageData2 },
        { seq: 2, data: testImageData3 },
      ],
    };
    window.setImages(JSON.stringify(exampleData));
  };
  const TextBtnCompo = (prop) => (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translate(0, -50%)",
      }}
    >
      <button onClick={handleTestBtn}> 테스트</button>
    </div>
  );

  let isTagComplete = false;
  if (returnData && returnData.length > 0) {
    // console.log(returnData);
    for (const rImgObj of returnData) {
      if (rImgObj.tags.length > 0) {
        isTagComplete = true;
        break;
      }
    }
  }

  const swipeHandlers = useSwipeable({
    // onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedLeft(e) {
      if (currentIdx < imageArray.length) {
        setImgSrc(imageArray[currentIdx + 1].data);
        setCurrentIdx(currentIdx + 1);
      } else {
        alert("다음 이미지가 없습니다.");
      }
    },
    onSwipedRight(e) {
      if (currentIdx > 0) {
        setImgSrc(imageArray[currentIdx - 1].data);
        setCurrentIdx(currentIdx - 1);
      } else {
        alert("이전 이미지가 없습니다.");
      }
    },
  });
  const handleImageLoaded = (e) => {
    // console.log(e.target.clientHeight);
    if (e.target.clientHeight < 400) {
      const moveY = (400 - e.target.clientHeight) / 2;
      // e.target.style.transform = `translateY(${moveY}px)`;
      e.target.style.marginTop = `${moveY}px`;
    } else {
      e.target.style.marginTop = 0;
    }
  };

  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0"
        />
        <title>Lulla ~ 모두가 행복한 유아의 성장, 랄라</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header
        style={{
          height: "44px",
          lineHeight: "44px",
          padding: "0",
        }}
      >
        <ul className="lnb_box">
          <li className="lnb_list">
            <div
              className="back_btn"
              style={{ paddingTop: "4px", boxSizing: "border-box" }}
              onClick={handleBackPress}
            >
              <Image src={leftArrow} />
            </div>
          </li>
          <li className="lnb_list">
            <div className="lnb_tag">
              <p className="lnb_text">
                <span
                  style={{ position: "relative", width: "100px" }}
                  onMouseEnter={() => setInfoVisible(true)}
                  onMouseLeave={() => setInfoVisible(false)}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: ".9em",
                    }}
                  >
                    직접 태그
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      float: "right",
                      right: "-24px",
                    }}
                  >
                    <Image src={infoIcon} />
                  </span>
                </span>
              </p>
            </div>
          </li>
          <li className="lnb_list">
            <button
              type="button"
              className="ok_btn"
              onClick={handleComplete}
              disabled={!isTagComplete}
            >
              완료
            </button>
          </li>
        </ul>
        {infoVisible && (
          <div
            className="ex_info"
            style={{
              background: "black",
              border: "none",
            }}
          >
            <div className="info_hover">
              하단 목록에서 원아를 선택하여 태그를 추가하세요
              <div className="info_close" onClick={() => setInfoVisible(false)}>
                <Image src={xBtn1} />
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <div
          className="view_box"
          style={{
            maxHeight: "400px",
            overflow: "hidden",
            textAlign: "center",
            background: "#efefef",
          }}
          {...swipeHandlers}
        >
          {isLoaded && (
            <>
              <img
                src={`data:image/*;base64,${imgSrc
                  .replace(/\n/g, "")
                  .replace(/\s*/g, "")}`}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onLoad={handleImageLoaded}
              />
              <div className="view_count">
                <p className="count_num">
                  <span className="now_count">{1 + currentIdx}</span>/
                  <span className="max_count">{imageArray.length}</span>
                </p>
              </div>
            </>
          )}
        </div>

        <AlbumTagSelect
          classList={classList}
          kidList={kidList}
          selectClass={selectClass}
          currentIdx={currentIdx}
          setSelectClass={setSelectClass}
          returnData={returnData}
          setReturnData={setReturnData}
        />
      </main>

      {isWebTestMode && <TextBtnCompo />}
    </div>
  );
}

export default class AlbumContainer extends Component {
  componentDidMount() {
    function getQueryStringObject() {
      var a = window.location.search.substr(1).split("&");
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p = a[i].split("=", 2);
        if (p.length == 1) b[p[0]] = "";
        else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    }

    let deviceType = "web";
    const qso = getQueryStringObject();
    if (qso.type == "ios") deviceType = "ios";
    if (qso.type == "android") deviceType = "android";

    setTimeout((t) => {
      alert("현재는 직접태깅 모드를 지원하지 않습니다.");
      if (deviceType == "ios") {
        window.webkit.messageHandlers.cancel.postMessage("");
      } else if (deviceType == "android") {
        window.app.cancel();
      } else {
        console.error("이기능은 앱에서 정상작동합니다.");
      }
    }, 300);
  }
  render() {
    return <></>;
  }
}
