import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import EmptyBox from "@/assets/imgs/empty_box.svg";
import ClearIcon from "@/assets/imgs/close_circle_fill_gray.svg";

import Image from "next/image";
import useStores from "@/stores/useStores";
const parseDate = (dateStr) => {

  console.log("!!!", dateStr);
  if (!dateStr) return "";

  let date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const apm = h < 12 ? "오전" : "오후";
  const hrs = h < 12 ? h : h - 12;
  const min = date.getMinutes();

  const t = (v) => {
    return v < 10 ? `0${v}` : v;
  };

  return `${t(y)}-${t(m)}-${t(d)} ${apm} ${t(hrs)}:${t(min)}`;
};

export const WriteBox = forwardRef(
  ({ initText, onInput, reporter, onClick, btnText }, textRef) => {
    const [texts, setTexts] = useState(null);
    const writeRef = useRef(null);
    const { reportStore } = useStores();
    const setWidthHeight = (e) => {
      if (!e?.current || !initText) {
        return {};
      }
      return {
        width: initText ? "100%" : "calc(100% - 50px)",
        height: e.current.scrollHeight + 2 + "px",
      };
    };

    useEffect(() => {
      console.log("initText ", initText);
      initText ? setTexts(initText) : null;
    }, [initText]);

    const clearText = useCallback(() => {
      textRef.current.value = "";
      textRef.current.style.height = "44px";
      writeRef.current.style.height = "44px";
      setTexts(null);
    });

    const onInputEvent = useCallback(() => {
      textRef.current.style.height =
        Number(textRef.current.scrollHeight).toString() + "px";

      writeRef.current.style.height =
        Number(textRef.current.scrollHeight).toString() + "px";

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
      console.log("totalByte", totalByte);

      if (totalByte > maxByte) {
        alert("최대 5000Byte까지만 입력가능합니다.");
      }

      setTexts(text);

      if (onInput) {
        onInput(text);
      }
    }, []);

    return (
      <div
        className="write_box"
        style={{
          backgroundColor: initText ? "var(--white)" : "var(--gray10)",
        }}
      >
        {reporter ? (
          <div className="upper_box">
            <span className="profile">
              <Image
                width="30px"
                height="30px"
                className=""
                src={reporter.profile || EmptyBox}
              />
            </span>
            <span className="name_box">{reporter.name}</span>
            <span className="time_box">{parseDate(reporter.created_at)}</span>
          </div>
        ) : null}
        <div ref={writeRef} className="write_area">
          <textarea
            ref={textRef}
            className="text_area"
            rows={1}
            placeholder={initText ? undefined : "오류 사항을 입력하세요"}
            onInput={onInputEvent}
            onBlur={() => {
              document.getElementsByClassName("Wrap")[0].scrollIntoView();
            }}
            disabled={initText ? true : false}
            style={setWidthHeight(textRef)}
            defaultValue={initText}
          ></textarea>
          {!initText && texts && texts.length > 0 && (
            <span className="clear_icon">
              <Image
                width="24px"
                height="24px"
                className=""
                src={ClearIcon}
                onClick={() => clearText()}
              />
            </span>
          )}
        </div>
        {reporter ? (
          <>
            <div className="lower_btn" onClick={onClick}>
              {" "}
              {reportStore.isEdited ? "태그 재수정" : "태그 수정"}{" "}
            </div>
            {reportStore.isEdited ? (
              <span style={{fontSize: "12px", color:"#9f9f9f"}}> { "태그 수정 | " + parseDate(reportStore.editedTime)}</span>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
);
