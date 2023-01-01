import { useEffect, useState } from "react";

/**
 * 태깅 박스를 포함한 태깅 영역
 *
 * @param {JSONArray} tags 태그 정보 kid_id, bbox
 * @param {HTMLImageElement} img 이미지 정보
 * @param {HTMLElement} imgAreaBox 이미지를 담고 있는 view_box DOM element
 * @param {string} tagType Tag 형태 bubble, box
 * @param {CallableFunction} onClick TagArea 클릭시 onClick function
 * @returns
 */
export default function TagArea({ tags, img, imgAreaBox, tagType, onClick }) {
  const tagPosition = ([left, top, right, bottom]) => {
    console.log("[tagPosition] original :", [left, top, right, bottom]);
    const fullScreenWidth = imgAreaBox.current.offsetWidth;
    let startX = left;
    let startY = top;
    let areaW = right - left;
    let areaH = bottom - top;

    // 이미지 배율 관련 다시 계산
    let newWidth = img.naturalWidth;
    let newHeight = img.naturalHeight;
    console.log("[tagPosition] img size : ", newWidth, newHeight);
    if (!newWidth || !newHeight) {
      console.log("[tagPosition] Img has not loaded yet");
      return;
    }
    const isLargeWidth = img.naturalHeight < img.naturalWidth;
    if (isLargeWidth) {
      // 가로가 더 크면
      newHeight = (img.naturalHeight * fullScreenWidth) / img.naturalWidth;
      newWidth = fullScreenWidth;
    } else {
      // 세로가 더 크면
      newWidth = (img.naturalWidth * 400) / img.naturalHeight;
      newHeight = 400;
    }
    let offsetX = (fullScreenWidth - newWidth) / 2;
    let offsetY = (400 - newHeight) / 2;
    startX = (newWidth * left) / img.naturalWidth;
    startY = (newHeight * top) / img.naturalHeight;
    if (offsetX == 0 || offsetY == 0) {
      // 배율 조정이 되었다고 간주
      // img.naturalWidth : areaW = newWidth : [NEW]
      areaW = (areaW * newWidth) / img.naturalWidth;
      // img.naturalHeight : areaH = newHeight : [NEW]
      areaH = (areaH * newHeight) / img.naturalHeight;
    }

    left = Math.abs(offsetX + startX);
    top = Math.abs(offsetY + startY);
    areaW = Math.abs(areaW);
    areaH = Math.abs(areaH);
    console.log("[tagPosition] repositioned : ", [
      left,
      top,
      left + areaW,
      top + areaH,
      areaW,
      areaH,
    ]);
    return {
      left: `${offsetX + startX}px`,
      top: `${offsetY + startY}px`,
      width: `${areaW}px`,
      height: `${areaH}px`,
    };
  };

  return (
    <>
      <div
        className={`tag_area ${tagType ? tagType : "box"}`}
        onClickCapture={onClick}
      >
        {Array.isArray(tags) &&
          tags.map((tag, i) => (
            <div
              key={i}
              className={`tag_zon ${tagType ? tagType : "box"}`}
              style={tagPosition(tag.bbox)}
            >
              <div
                data-tag-idx={i}
                className={`tag_line ${tagType ? tagType : "box"}`}
              ></div>
              <p
                className={`tag_name ${tagType ? tagType : "box"}`}
                hidden={!tag?.kid_name}
                kid-id={tag?.kid_id}
              >
                {tag?.kid_name}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
