import react, { useState } from "react";
import Canvas from "./TagCanvas/Canvas";
import Image from "next/image";
import circleX from "@/assets/imgs/circle_x.svg";

export default function AITagView({
  tags,
  handleTagClick,
  handleTagDelClick,
  imgSrc,
}) {
  return (
    <div className="tag_box">
      <p className="tag_count">
        <span className="tag_num">{tags?.length ?? 0}</span> 명이
        태그되었습니다.
      </p>
      {!tags || tags.length == 0 ? (
        <div className="image_default">
          <p>
            인식 된 얼굴이 없습니다. <br />
            영역을 선택하여 원아를 태그하세요.
          </p>
        </div>
      ) : null}
      <div className="image_tag_box">
        <ul className="image_list">
          {tags?.filter(tag => (tag?.kid_id != null)).map((tag, i) => (
            <li key={i} className="imgae_li">
              <div className="cut_img" onClick={() => handleTagClick(tag)}>
                <Canvas
                  key={i}
                  img={new window.Image()}
                  imgSrc={imgSrc}
                  width={100}
                  height={100}
                  canvasAttr={{
                    // tag.bbox : [left, top, right, bottom]
                    sx: tag.bbox[0], // left
                    sy: tag.bbox[1], // top
                    sWidth: tag.bbox[2] - tag.bbox[0], // right - left
                    sHeight: tag.bbox[3] - tag.bbox[1], // bottom - top
                    dx: 0,
                    dy: 0,
                    dWidth: 110,
                    dHeight: 110,
                  }}
                />
                <span
                  className="tag_del"
                  onClick={() => handleTagDelClick(tag,i)}
                >
                  <Image src={circleX} />
                </span>
              </div>
              <p className="child_name">{tag?.kid_name}</p>
              <p className="child_class">{tag?.class_name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
