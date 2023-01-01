import React, { useRef, useEffect } from "react";

export default function Canvas({
  width,
  height,
  loading,
  img,
  imgSrc,
  canvasAttr,
  resizing,
}) {
  const viewBox = useRef(null);

  const renderImage = function (src) {
    img.src = src;
    img.onload = function () {
      const ctx = viewBox.current.getContext("2d");
      // CanvasRenderingContext2D.drawImage(대상이미지, 이미지 기준점 x-axis, 이미지 기준점 y-axis, 이미지 기준점으로부터의 너비, 이미지 기준점으로부터의 높이, 캔버스 기준점 x-axis, 캔버스 기준점 y-axis, 캔버스 기준점으로부터의 너비, 캔버스 기준점으로부터의 높이)
      // [Reference] https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      ctx.drawImage(
        img,
        canvasAttr?.sx ?? 0,
        canvasAttr?.sy ?? 0,
        canvasAttr?.sWidth ?? img.naturalWidth,
        canvasAttr?.sHeight ?? img.naturalHeight,
        canvasAttr?.dx ?? 0,
        canvasAttr?.dy ??
          (img.naturalHeight < 400 ? (400 - img.naturalHeight) / 2 : 0),
        canvasAttr?.dWidth ?? window.outerWidth,
        canvasAttr?.dHeight ??
          (img.naturalHeight < 400 ? img.naturalHeight : 400)
      );
    };
  };

  useEffect(() => {
    const resize = function () {
      if (viewBox.current) {
        viewBox.current.width = width ?? window.outerWidth;
        viewBox.current.height = height ?? 400;
        if (imgSrc) renderImage(imgSrc);
      }
    };
    resize();
    if (resizing) window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [imgSrc]);

  return (
    <canvas
      ref={viewBox}
      style={{
        width: "100%",
        filter: loading ? "brightness(0.5)" : "unset",
      }}
    ></canvas>
  );
}
