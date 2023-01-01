import { useState } from "react";
import axios from "axios";
import useStores from "@/stores/useStores";
import useInput from "@/lib/hooks/useInput";
import classnames from "classnames";
import { observer } from "mobx-react-lite";
import PasswordChange from "./PasswordChange";
import PhoneNumberChange from "./PhoneNumberChange";
import regex from "@/assets/regex";

const AccountContentsComponent = observer((props) => {
  // State
  const { authStore } = useStores();
  const userInfo = authStore.userInfo;
  const { inputs, handleChange, reset } = useInput(
    {
      name: userInfo?.name ?? "",
    },
    { dependencies: [userInfo] }
  );

  const [changeInputActive, setChangeInputActive] = useState(false);
  const [phoneNumberChangeActive, setPhoneNumberChangeActive] = useState(false);
  const [passwordChangeActive, setPasswordChangeActive] = useState(false);

  // Event Handler
  const handleClickChange = (e) => {
    if (e) e.preventDefault();
    e.preventDefault();
    setChangeInputActive(true);
  };

  const handleClickCancel = (e) => {
    if (e) e.preventDefault();
    setChangeInputActive(false);
    reset();
  };

  const handleClickSave = async (e) => {
    if (e) e.preventDefault();
    if (!userInfo?.id || !userInfo?.name || !inputs.name) return;

    if (inputs.name === userInfo?.name) {
      setChangeInputActive(false);
      return;
    }

    const res = await axios({
      method: "post",
      url: "/api/v1/user/name",
      data: {
        user_id: userInfo.id,
        name: inputs.name,
      },
      headers: {
        Authorization: "Bearer " + authStore.authToken,
      },
    }).catch((err) => console.warn(err));
    console.log(res);
    if (!res || !res?.data?.resultCode < 0) return; // error
    authStore.setUserInfo({ ...userInfo, name: inputs.name });
    setChangeInputActive(false);
  };

  return (
    <>
      <main>
        <div className="box_m">
          <div className="title_box account_titlebox">
            <p className="account_title">개인정보</p>
          </div>
          <section className="sec_3">
            <div className="lulla_information">
              <div className="information_title">
                <p>계정 정보</p>
              </div>

              <ul className="information_list">
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">이메일</p>
                    <p className="info_data_text">
                      {userInfo && userInfo.email
                        ? userInfo.email
                        : "loading.."}
                    </p>
                  </div>
                </li>
                <li
                  className={classnames({
                    change: changeInputActive,
                  })}
                >
                  <div className="info_flex_one">
                    <p className="info_subtitle">이름</p>
                    {!changeInputActive ? (
                      <p className="info_data_text">
                        {userInfo && userInfo.name
                          ? userInfo.name
                          : "loading.."}
                      </p>
                    ) : (
                      <div>
                        <div>
                          <input
                            type="text"
                            name="name"
                            className="info_input account_input request_input"
                            placeholder="이름"
                            value={inputs.name}
                            onChange={handleChange}
                          />
                        </div>
                        <button
                          type="button"
                          className="info_btn account_save"
                          onClick={handleClickSave}
                        >
                          저장
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="info_flex_two">
                    <a
                      className="information_change"
                      onClick={
                        !changeInputActive
                          ? handleClickChange
                          : handleClickCancel
                      }
                    >
                      {!changeInputActive ? "변경" : "취소"}
                    </a>
                  </div>
                </li>
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">휴대폰 번호</p>
                    <p className="info_data_text">
                      {userInfo && userInfo.phone
                        ? userInfo.phone.replace(regex.phoneFormat, "$1-$2-$3")
                        : "loading.."}
                    </p>
                  </div>
                  <div className="info_flex_two">
                    <a
                      className="information_change"
                      onClick={() => setPhoneNumberChangeActive(true)}
                    >
                      변경
                    </a>
                  </div>
                </li>
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">비밀번호</p>
                    <p className="info_data_text"> </p>
                  </div>
                  <div className="info_flex_two">
                    <a
                      className="information_change"
                      onClick={() => setPasswordChangeActive(true)}
                    >
                      변경
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="account_delet">
              <p className="disabled">회원 탈퇴</p>
            </div>
          </section>
        </div>
        {/* PopUp & Toast */}
        {phoneNumberChangeActive && (
          <PhoneNumberChange
            onClose={() => setPhoneNumberChangeActive(false)}
          />
        )}
        {passwordChangeActive && (
          <PasswordChange onClose={() => setPasswordChangeActive(false)} />
        )}
      </main>
      <style jsx>{`
        .title_box {
          width: 100%;
          padding: 64px 0px 32px;
          margin: 0;
        }
      `}</style>
    </>
  );
});

export default (props) => <AccountContentsComponent {...props} />;
