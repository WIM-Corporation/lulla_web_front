import React, { useRef, useEffect } from "react";

export default function FullCanvas({
  width,
  height,
  loading,
  isVideo,
  img,
  imgSrc,
  mediaType,
  canvasAttr,
  resizing,
  onLoad,
  onPause,
  tags,
}) {
  const viewBox = useRef(null);
  const videoBox = useRef(null);

  const drawCanvas = (img) => {
    if (!viewBox.current) {
      console.error("[drawCanvas] Viewbox.current is null.");
      return;
    }

    const ctx = viewBox.current.getContext("2d");
    let dx = 0;
    let dy = 0;
    let newWidth = img.naturalWidth || img.width;
    let newHeight = img.naturalHeight || img.height;

    if (!newWidth || !newHeight) {
      console.error(
        "[drawCanvas] Img has not loaded yet. Cannot get image width/height"
      );
      return;
    }

    const isLargeWidth = img.naturalHeight < img.naturalWidth;
    if (isLargeWidth) {
      // 가로가 더 크면
      if (img.naturalWidth > viewBox.current.width) {
        newHeight =
          (img.naturalHeight * viewBox.current.width) / img.naturalWidth;
        newWidth = viewBox.current.width;
      }
    } else {
      // 세로가 더 크면
      if (img.naturalHeight > 400) {
        newWidth = (img.naturalWidth * 400) / img.naturalHeight;
        newHeight = 400;
      }
    }
    dy = (400 - newHeight) / 2;
    dx = (viewBox.current.width - newWidth) / 2;
    // CanvasRenderingContext2D.drawImage(대상이미지, 이미지 기준점 x-axis, 이미지 기준점 y-axis, 이미지 기준점으로부터의 너비, 이미지 기준점으로부터의 높이, 캔버스 기준점 x-axis, 캔버스 기준점 y-axis, 캔버스 기준점으로부터의 너비, 캔버스 기준점으로부터의 높이)
    // [Reference] https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    ctx.drawImage(img, dx, dy, newWidth, newHeight);
    if (onLoad) onLoad();
  };

  const renderImage = function (src) {
    if (isVideo) {
      //videoBox.src = imgSrc;
      drawCanvas(videoBox.current);
    } else {
      img.src = src;
      img.addEventListener("load", function () {
        console.log(
          "[renderImage] Image Loaded. img.complete : ",
          img.complete
        );
        drawCanvas(img);
      });
    }
  };

  useEffect(() => {
    const resize = function () {
      if (viewBox.current) {
        viewBox.current.width = width ?? window.outerWidth;
        viewBox.current.height = height ?? 400;
        if (videoBox.current) {
          videoBox.current.width = window.outerWidth;
          videoBox.current.height = height ?? 400;
        }
        if (imgSrc) renderImage(imgSrc);
      }
    };
    resize();
    if (resizing) window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [img, imgSrc]);

  return (
    <>
      {isVideo ? (
        <video
          ref={videoBox}
          src={imgSrc + "#t=0.5"}
          onPause={onPause}
          playsInline
          muted
          controls
        ></video>
      ) : null}

      <canvas
        ref={viewBox}
        style={{
          width: "100%",
          filter: loading ? "brightness(0.5)" : "unset",
        }}
      ></canvas>
    </>
  );
}
