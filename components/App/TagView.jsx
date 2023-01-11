import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AlbumTagSelect(props) {
  const isWebTestMode = false; // 웹에서 테스트 하는 경우만 사용

  const [imageList, setImageList] = useState([]);
  const [curIndex, setCurIndex] = useState(0);

  useEffect(() => {
    function setAlbumImage(jsonStr) {
      const data = JSON.parse(jsonStr);

      axios
        .post("/api/v1/album/detail", {
          member_id: data.member_id,
          id: data.album_id,
        })
        .then((res) => {
          setImageList(res.album.medias);
          setCurIndex(0);
        })
        .catch((err) => {
          console.error(err);
          alert("통신에 문제가 발생하였습니다.\n" + err.message);
        });
    }
    // 클라이언트에서만 window가 존재
    if (window) {
      window.setAlbumImage = setAlbumImage;
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

  const handleNext = (e) => {
    setCurIndex(1 + curIndex);
  };
  const handlePrev = (e) => {
    setCurIndex(curIndex - 1);
  };
  // [TEST] ---
  const handleTestBtn = (e) => {
    const exampleData = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhmNzliNWJlLTJmZWMtMTFlYy1iNTA1LTAyNDJhYzExMDAwMyIsIm5hbWUiOiJpb3MiLCJleHAiOjE2NzM1NjgxMzcuMDQ0LCJpYXQiOjE2NDI0NjQxMzd9.tKkj0k1y2HYxcKseueqLfWqobIftuYb-K-iGj0As1CE",
      member_id: "0dddcb4e-9162-11ec-821f-0af154999872",
      album_id: "b1d81b02-d78d-11ec-825f-0af154999872",
    };
    setAlbumImage(JSON.stringify(exampleData));
  };
  const TextBtnCompo = (prop) => (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translate(0, -50%)",
        zIndex: 100,
      }}
    >
      <button onClick={handleTestBtn}> 테스트</button>
    </div>
  );
  // [TEST] ---

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        background: "black",
      }}
    >
      {isWebTestMode && <TextBtnCompo />}
      <div
        id="header"
        style={{
          display: "flex",
          flexWrap: "row nowrap",
          justifyContent: "space-between",
          position: "absolute",
          width: "100%",
          height: "64px",
          background: "#111",
          color: "white",
        }}
      >
        <div
          style={{
            color: "white",
            lineHeight: "64px",
            flexGrow: 1,
            paddingLeft: "16px",
          }}
        >
          <span onClick={handleBackPress}>back</span>
        </div>
        <div
          style={{
            color: "white",
            lineHeight: "64px",
            flexGrow: 4,
            textAlign: "center",
          }}
        >
          {imageList.length > 0
            ? 1 + curIndex + "/" + imageList.length
            : "loading.."}
        </div>
        <div
          style={{
            color: "white",
            lineHeight: "64px",
            flexGrow: 1,
            paddingRight: "16px",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <div
        style={{
          position: "relative",
          top: "65px",
          left: "0",
          width: "100vw",
          height: "calc(100vh - 65px)",
        }}
      >
        {imageList.length < 1
          ? "로딩중"
          : imageList.map((item) => (
              <figure
                style={{
                  margin: "0",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  // overflowY: "hidden",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <img
                  key={item.id}
                  src={item.file_url}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
                <figcaption
                  style={{
                    display: "inline-block",
                    position: "absolute",
                    fontSize: "5em",
                    color: "blue",
                  }}
                >
                  블라블라 {JSON.stringify(item.tag)}
                </figcaption>
              </figure>
            ))}
      </div>
      <div
        style={{
          zIndex: 10,
          position: "fixed",
          width: "100%",
          bottom: "40%",
          display: "flex",
          flexWrap: "row nowrap",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={handlePrev}
          style={{
            color: "red",
            padding: "16px",
          }}
        >
          이전
        </div>
        <div
          onClick={handleNext}
          style={{
            color: "red",
            padding: "16px",
          }}
        >
          다음
        </div>
      </div>
    </div>
  );
}
