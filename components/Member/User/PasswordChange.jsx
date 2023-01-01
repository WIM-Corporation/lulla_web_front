import regex from "@/assets/regex";
import useInput from "@/lib/hooks/useInput";
import useStores from "@/stores/useStores";
import axios from "axios";
import classnames from "classnames";

export default ({ onClose, changeCb }) => {
  const { authStore, globalStore } = useStores();
  const initialState = {
    password: "",
    passwordCheck: "",
  };
  const { inputs, setInputs, handleChange, error, setError } =
    useInput(initialState);

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!regex.password.test(inputs.password)) {
      setError({
        ...initialState,
        password: "8~20자의 영문, 숫자로 조합해 주세요.",
      });
      setInputs(initialState);
      return;
    }
    if (inputs?.password !== inputs?.passwordCheck) {
      setError({
        ...initialState,
        passwordCheck: "비밀번호가 일치하지 않습니다.",
      });
      setInputs({ ...inputs, passwordCheck: "" });
      return;
    }
    // 설계서 5번 validation 화면은 API 추가로 만들어야 함(굳이 필수기능은 아니라서 일단 보류)
    const res = await axios({
      method: "post",
      url: "/api/v1/user/password",
      data: {
        user_id: authStore.userInfo.id,
        password: inputs.password,
      },
      headers: {
        Authorization: "Bearer " + authStore.authToken,
      },
    }).catch((err) => console.warn(err));
    if (!res || !res?.data?.resultCode < 0) return; // error

    console.log(res);
    onClose();
    globalStore.setToastActive(
      "모든 기기에서 변경된 비밀번호로 다시 로그인해주세요."
    );
    if (changeCb) changeCb();
  };

  return (
    <>
      <div className="mask">
        <div className="adm_popupBox5">
          <div className="adm_header3">
            <p>비밀번호 변경</p>
            <div className="popup_closeBox" onClick={onClose}>
              <img src="/imgs/icon-close-s.png" />
            </div>
          </div>

          <div className="inactive_infoBox">
            <p className="won_adm_Text">
              변경할 비밀번호를 입력해 주세요.
              <br />
              비밀번호는 8-20자 이내 영문과 숫자를 포함합니다.
            </p>
            <ul className="info_form">
              <li className="info_list">
                <input
                  type="password"
                  name="password"
                  className={classnames({
                    info_input: true,
                    warning: error?.password,
                  })}
                  placeholder="비밀번호"
                  value={inputs?.password ?? ""}
                  onChange={handleChange}
                />
                {error?.password && (
                  <p className="warning_text">{error.password}</p>
                )}
              </li>
              <li className="info_list">
                <input
                  type="password"
                  name="passwordCheck"
                  className={classnames({
                    info_input: true,
                    warning: error?.passwordCheck,
                  })}
                  placeholder="비밀번호 확인"
                  value={inputs?.passwordCheck ?? ""}
                  onChange={handleChange}
                />
                {error?.passwordCheck && (
                  <p className="warning_text">{error.passwordCheck}</p>
                )}
              </li>
              <li className="info_list">
                <button
                  type="button"
                  className="info_btn"
                  disabled={
                    inputs?.password === "" || inputs?.passwordCheck === ""
                  }
                  onClick={handleChangePassword}
                >
                  확인
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .popup_closeBox {
          position: absolute;
          right: 24px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};
