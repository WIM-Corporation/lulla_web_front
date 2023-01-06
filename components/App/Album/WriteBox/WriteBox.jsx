import { forwardRef, useCallback, useEffect, useState } from "react";
import EmptyBox from "@/assets/imgs/empty_box.svg";
import Image from "next/image";

export const WriteBox = forwardRef(
  ({ initText, onInput, reporter }, textRef) => {
    const [texts, setTexts] = useState(null);

    useEffect(() => {
      initText ? setTexts(initText) : null;
    }, []);

    const onInputEvent = useCallback(() => {
      console.log("textRef.current.scrollHeight", textRef.current.scrollHeight);
      textRef.current.style.height =
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

      if (totalByte > maxByte) {
        alert("최대 5000Byte까지만 입력가능합니다.");
      }

      if (onInput) {
        onInput(text);
      }
    }, []);

    return (
      <div className="write_box">
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
            <span className="name_box">
              {reporter.class_name + " " + reporter.name}
            </span>
            <span className="time_box">{reporter.created_time}</span>
          </div>
        ) : null}
        <textarea
          ref={textRef}
          className="text_area"
          rows={1}
          placeholder="오류 사항을 입력하세요"
          onInput={onInputEvent}
          onBlur={() => {
            document.getElementsByClassName("Wrap")[0].scrollIntoView();
          }}
          disabled={initText ? true : false}
        >
          {initText}
        </textarea>
        {reporter ? <div className="lower_btn"> 태그 수정 </div> : null}
      </div>
    );
  }
);
