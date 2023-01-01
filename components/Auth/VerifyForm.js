import { useState, useEffect } from "react";
import useInput from "@/lib/hooks/useInput";
import TextField from "@/components/Auth/TextField";
import useLoading from "@/lib/hooks/useLoading";
import { useRouter } from "next/router";
import axios from "axios";
import { onChangeCondition } from "@/lib/InputUtil";
import { useRef } from "react";

export default function VerifyForm({ from, onSuccess, onFailure, onSubmit }) {
  const router = useRouter();
  const initialState = { name: "", phoneNumber: "" };
  const initialTimer = { min: 10, sec: 0 };
  const [timer, setTimer] = useState(initialTimer);

  const { status, handleStatus, error, message, handleMessage } =
    useLoading("initial");

  const { inputs, setInputs, handleChange } = useInput(initialState, {
    onChangeCondition,
    cb: () => {
      handleStatus("initial");
      handleMessage("");
    },
  });
  const { name, phoneNumber, verificationCode } = inputs;

  const handleRequest = async (e, isReset) => {
    if (from == "signup") {
      // 회원가입에서 호출된 폼이면
      // 휴대폰 중복 검사를 먼저 수행
      try {
        const response = await axios({
          method: "post",
          url: "/api/v1/auth/check-phone",
          data: { phone: phoneNumber },
        });
        // console.log(response.data);
        if (response.data.resultCode == -320) {
          onFailure();
          return;
        }
      } catch (error) {
        // 에러나면 그냥 무시하고 진행
        console.log(error);
      }
    }
    let type = 0;
    switch (from) {
      case "id":
        type = 1;
        break;
      case "password":
        type = 2;
        break;
      default:
        type = 0;
        break;
    }
    // 인증하기 요청 API 연동
    let reqParams = { type, phone: phoneNumber };
    if (process.env.NODE_ENV != "production") reqParams.debug = "ok";
    // API 통신 시작
    axios({
      method: "post",
      url: "/api/v1/auth/gencode",
      data: reqParams,
    })
      .then(({ data: respData }) => {
        console.log(respData);
        if (respData.resultCode == 1) {
          // 초기 인증하기 요청 Request: Verification input과 인증하기 버튼 활성화
          setInputs({ ...inputs, verificationCode: "" });
          handleStatus("initial");
          // 인증번호 재요청 Request: Verification input value, error, timer 초기화
          if (isReset) {
            setTimer(initialTimer);
            handleMessage("인증번호를 재발송했습니다.");
          }
        } else {
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };

  const handleSubmit = () => {
    // 인증 확인 callback
    if (verificationCode && verificationCode.length == 4) {
      let type = 0;
      switch (from) {
        case "id":
          type = 1;
          break;
        case "password":
          type = 2;
          break;
        default:
          type = 0;
          break;
      }
      axios({
        method: "post",
        url: "/api/v1/auth/check-code",
        data: {
          code: verificationCode,
          phone: phoneNumber,
          type,
        },
      })
        .then(({ data: respData }) => {
          // console.log(respData);
          if (respData.resultCode == 1) {
            handleStatus("success");
            if (onSuccess) onSuccess({ phone: phoneNumber, name }); // 성공함수 호출 (부모)
          } else if (respData.resultCode == -330) {
            handleStatus("error");
            handleMessage(
              <>
                잘못된 인증번호 입니다. 확인 후 다시 시도해주세요.
                <br />
                또는 인증번호를 재요청하여 새로운 코드를 받으세요.
              </>
            );
            // if (onFailure) onFailure(res);
          } else {
            console.warn(respData);
            alert(respData.message);
          }
        })
        .catch((err) => {
          alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
          console.error(err);
        });
    } else {
      handleStatus("error");
      handleMessage(<>인증번호를 확인해주세요</>);
    }
  };

  useEffect(() => {
    setInputs(initialState);
    handleStatus("initial");
    setTimer(initialTimer);
    if (ref.current) ref.current.focus();
  }, [router]);

  const isVerify = verificationCode || verificationCode === "";
  const ref = useRef(null);
  return (
    <ul className="info_form">
      <TextField
        ref={ref}
        type="text"
        placeholder="이름"
        name="name"
        value={name}
        onChange={handleChange}
      />
      <TextField
        type="text"
        placeholder="휴대폰 번호"
        name="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
      />
      {isVerify && (
        <TextField
          type="text"
          name="verificationCode"
          placeholder="인증 번호"
          value={verificationCode}
          onChange={handleChange}
          error={error}
          helperText={message}
          timer={timer}
          handleTimer={setTimer}
          onTimeset={() => {
            handleStatus("error");
            handleMessage(
              <>
                인증시간이 초과되었습니다. <br />
                인증번호를 재요청하여 새로운 코드를 받으세요.
              </>
            );
          }}
        />
      )}
      <li className="info_list">
        <button
          type="button"
          className="info_btn"
          disabled={
            Object.values(inputs).some((v) => v === "") ||
            Object.values(timer).every((v) => v === 0) ||
            !phoneNumber.match(phoneNumberRegExp) ||
            error
          }
          onClick={isVerify ? handleSubmit : handleRequest}
        >
          {isVerify ? "인증하기" : "인증 요청"}
        </button>
        {isVerify && (
          <div className="request_btn">
            <button
              type="button"
              className="request_go"
              onClick={(e) => handleRequest(e, true)}
            >
              인증번호 재요청
            </button>
          </div>
        )}
      </li>
    </ul>
  );
}

// RegExp
const notCharRegExp = /[^a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
const phoneNumberRegExp = /\d{3}-\d{4}-\d{4}/g;
const notPhoneNumberAtomRegExp = /[^\d-]/g;
