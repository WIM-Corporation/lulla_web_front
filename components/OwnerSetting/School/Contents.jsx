import useInput from "@/lib/hooks/useInput";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import regex from "@/assets/regex";
import { onChangeCondition } from "@/lib/InputUtil";
import { useState } from "react";
import classnames from "classnames";
import AreaSelectBox from "./AreaSelectBox";

const SchoolSettingComponent = observer(() => {
  const { authStore } = useStores();
  const curMember = authStore?.curMember;
  console.log(curMember);
  const [tab, setTab] = useState("setting");

  const { inputs, setInputs, handleChange, error, setError } = useInput(
    {
      name: curMember?.School?.name ?? "",
      admin_name: curMember?.School?.admin_name ?? "",
      tel: curMember?.School?.tel.replace(regex.telephone, "$1-$2-$3") ?? "",
      address: curMember?.School?.address ?? "",
      sido: { id: curMember?.School?.district_one_id ?? "", name: "" },
      sigungu: { id: curMember?.School?.district_two_id ?? "", name: "" },
    },
    {
      onChangeCondition,
      dependencies: [curMember],
    }
  );
  const { sido, sigungu } = inputs;

  const buttonDisabled =
    inputs.name === curMember?.School?.name &&
    inputs.admin_name === curMember?.School?.admin_name &&
    inputs.tel ===
      curMember?.School?.tel.replace(regex.telephone, "$1-$2-$3") &&
    inputs.address === curMember?.School?.address &&
    !(
      inputs.sigungu.id &&
      inputs.sigungu.id !== curMember?.School?.district_two_id
    );

  if (!authStore.isMemberLoaded) return <div />;
  return (
    <>
      <main className="admin_box">
        <div className="adm_box">
          <div className="adm_header">
            <p className="adm_title">원 정보</p>
            <p className="adm_subtext">
              원의 정보를 변경할 수 있습니다. 다른 사용자에게 동일하게 제공되는
              정보이므로 한번 더 확인해주세요.
              {/** 원장 권한 위임을 진행하면 기존 원장 계정은 정리되고, 원 운영 관리를 위한 모든 권한이 위임 대상자에게 위임됩니다. <br>
              위임일 전까지 취소 가능하며 완료 후에는 불가합니다. 위임 완료 후 원 정보 내 원장님 이름을 수정해주시기 바랍니다. */}
            </p>

            <div className="won_admTabbox">
              <div className="adm_tabBox">
                <div
                  className={classnames({
                    adm_tab: true,
                    on: tab === "setting",
                  })}
                  onClick={() => setTab("setting")}
                >
                  <p>원 정보</p>
                </div>
                <div
                  className={classnames({
                    adm_tab: true,
                    on: tab === "delegate",
                  })}
                  onClick={() => setTab("delegate")}
                >
                  <p>원장 권한 위임</p>
                </div>
              </div>

              {tab === "delegate" && (
                <div className="won_adm_btnBox">
                  <div className="won_admBTn1">
                    <p>원 내 초대</p>
                  </div>
                  <div className="won_admBTn2">
                    <p>신규 초대</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="sec_2">
            {tab === "setting" ? (
              <div className="mandate_box2">
                <div className="mandate_list">
                  <p className="mandate_title">원 이름</p>
                  <div className="adm_inputBox2">
                    <input
                      type="text"
                      className="info_input request_input"
                      placeholder="원 이름"
                      name="name"
                      value={inputs.name}
                      onChange={handleChange}
                    />
                    {/* <p className="warning_text2">원 이름을 입력해주세요.</p> */}
                  </div>
                </div>

                <div className="mandate_list">
                  <p className="mandate_title">원장님 이름</p>
                  <input
                    type="text"
                    className="info_input"
                    name="admin_name"
                    value={inputs.admin_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mandate_list">
                  <p className="mandate_title">원 전화번호</p>
                  <div className="adm_inputBox2">
                    <input
                      type="text"
                      className="info_input request_input"
                      placeholder="전화번호"
                      name="tel"
                      value={inputs.tel}
                      onChange={handleChange}
                    />
                    {/* <p className="warning_text2">전화번호를 입력해주세요.</p> */}
                  </div>
                </div>

                <div className="mandate_list">
                  <p className="mandate_title">원 주소</p>
                  <div className="mandate_halfBox">
                    <AreaSelectBox
                      sido={sido}
                      sigungu={sigungu}
                      handleChangeArea={(name, value, others) => {
                        setInputs({
                          ...inputs,
                          [name]: value,
                          ...(others ?? {}),
                        });
                      }}
                    />
                    <input
                      type="text"
                      className="info_input"
                      name="address"
                      value={inputs.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mandate_list">
                  <p className="mandate_title"></p>
                  <ul className="adm_inputList2">
                    <li className="adm_inputItem2">
                      <button
                        type="button"
                        className="invite_cancle_B invite_btn2"
                        disabled={buttonDisabled}
                      >
                        취소
                      </button>
                    </li>
                    <li className="adm_inputItem2">
                      <button
                        type="button"
                        href=""
                        className="invite_ok_btn invite_btn2"
                        disabled={buttonDisabled}
                      >
                        저장
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="adm_noneBox">
                <p>원장 권한 위임 진행 중이 아닙니다.</p>
              </div>
            )}

            {/* <div className="invite_excess">
            <p>원 정보가 변경되었습니다.</p>
          </div> */}
          </section>
        </div>
      </main>
      <style jsx>{``}</style>
    </>
  );
});

const SchoolSetting = (props) => <SchoolSettingComponent {...props} />;
export default SchoolSetting;
