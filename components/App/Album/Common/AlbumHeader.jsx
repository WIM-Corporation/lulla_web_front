import React, { useState } from "react";

import Image from "next/image";
import infoIcon from "@/assets/icons/info-fill-gray-24.svg";
import leftArrow from "@/assets/imgs/back_left.svg";
import closeX from "@/assets/imgs/close_line_white.svg";
import xBtn1 from "@/assets/imgs/x_btn.png";

export const AlbumHeaderComponent = ({
  onConfirm,
  onBackBtn,
  title,
  activeBtn,
  backBtnType,
  infoBtn,
}) => {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <header>
        <ul className="lnb_box">
          <li className="lnb_list back_con">
            <span className="back" onClick={onBackBtn}>
              {backBtnType == "x" ? (
                <Image src={closeX} />
              ) : (
                <Image src={leftArrow} />
              )}
            </span>
          </li>
          <li className="lnb_list">
            <div className="lnb_tag">
              <div className="lnb_text">
                <span className="title">{title}</span>
                {title && infoBtn ? (
                  <>
                    <span
                      className="info_hover_container"
                      onMouseEnter={() => setInfoVisible(true)}
                      onMouseLeave={() => setInfoVisible(false)}
                    >
                      <Image src={infoIcon} />
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </li>
          <li className="lnb_list ok_con">
            {onConfirm || activeBtn !== undefined ? (
              <button
                type="button"
                className="ok_btn"
                onClick={onConfirm}
                disabled={!activeBtn}
              >
                완료
              </button>
            ) : null}
          </li>
        </ul>
        {infoVisible && (
          <div className="ex_info">
            <div className="info_hover">
              사진의 빈 영역 선택 시 직접 태그 추가가 가능합니다.
              <div className="info_close" onClick={() => setInfoVisible(false)}>
                <Image src={xBtn1} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default function AlbumHeader(props) {
  return AlbumHeaderComponent(props);
}
