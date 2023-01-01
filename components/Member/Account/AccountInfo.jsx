import { observer } from "mobx-react-lite";
import useStores from "@/stores/useStores";
import { useMemo } from "react";
import { req } from "@/lib/apiUtil";
import { useEffect } from "react";
import { useState } from "react";
import useInput from "@/lib/hooks/useInput";
import classnames from "classnames";

const AccountInfoComponent = observer(() => {
  const { authStore } = useStores();
  const curMember = authStore.curMember;
  const [familyData, setFamilyData] = useState(null);
  const [year, month, date] = useMemo(() => {
    if (!familyData) return ["", "", ""];
    return familyData?.kid?.birth.split("-");
  }, [familyData]);
  const [editState, setEditState] = useState({
    name: false,
    birth: false,
    gender: false,
  });

  const initialState = {
    name: familyData?.kid?.name ?? "",
    birthYear: year ?? "",
    birthMonth: month ?? "",
    birthDate: date ?? "",
    gender: familyData?.kid?.gender,
  };
  const { inputs, setInputs, handleChange, error, setError } = useInput(
    initialState,
    {
      dependencies: [familyData],
      cb: ({ name, value }) => {
        setError({
          name: name === "name" && !value,
          birthYear: name === "birthYear" && !value,
          birthMonth:
            name === "birthMonth" &&
            (!value || Number(value) < 1 || Number(value) > 12),
          birthDate:
            name === "birthDate" &&
            (!value || Number(value) < 1 || Number(value) > 31),
          gender: name === "gender" && (!value || value > 1),
        });
      },
      initialError: {
        name: "",
        birthYear: "",
        birthMonth: "",
        birthDate: "",
        gender: "",
      },
    }
  );

  const handleEditState = (e, name) => {
    if (e) e.preventDefault();
    if (curMember?.grade > 5) return;
    if (editState[name]) {
      if (name !== "birth")
        setInputs({ ...inputs, [name]: initialState[name] });
      else
        setInputs({
          ...inputs,
          birthYear: initialState.birthYear,
          birthMonth: initialState.birthMonth,
          birthDate: initialState.birthDate,
        });
    }
    setEditState({ ...editState, [name]: !editState[name] });
  };

  const handleEditKid = async (name) => {
    if (!authStore.isAuth || !curMember?.id || !familyData?.kid?.id) return;
    const res = await req(
      "/api/v1/kid/update",
      {
        method: "post",
        data: {
          member_id: curMember.id,
          kid_id: familyData.kid.id,
          [name]:
            name === "birth"
              ? `${inputs.birthYear}-${
                  inputs.birthMonth.length < 2
                    ? "0" + inputs.birthMonth
                    : inputs.birthMonth
                }-${
                  inputs.birthDate.length < 2
                    ? "0" + inputs.birthDate
                    : inputs.birthDate
                }`
              : String(inputs[name]),
        },
      },
      authStore.authToken
    ).catch((err) => console.warn(err));

    setEditState({ ...editState, [name]: false });
    // console.log(res);
    if (!res || res.data.resultCode < 0) return;
    getFamilyProfile();
  };

  const getFamilyProfile = async () => {
    const res = await req(
      "/api/v1/member/family",
      {
        method: "post",
        data: {
          member_id: curMember.id,
          with: "kid",
        },
      },
      authStore.authToken
    ).catch((err) => console.warn(err));
    // console.log(res.data);
    if (!res && res.data.resultCode < 0) return;
    setFamilyData(res.data.data);
  };

  useEffect(() => {
    if (curMember && curMember.grade >= 5) getFamilyProfile();
  }, [curMember]);

  const infoList = useMemo(() => {
    if (curMember?.grade <= 3)
      return (
        <>
          {curMember?.grade > 1 && curMember?.is_admin && (
            <li>
              <div className="info_flex_one">
                <p className="info_subtitle">이름</p>
                <p className="info_data_text">{curMember?.nickname ?? ""}</p>
              </div>
            </li>
          )}
          <li>
            <div className="info_flex_one">
              <p className="info_subtitle">역할</p>
              <p className="info_data_text">{curMember?.relation ?? ""}</p>
            </div>
          </li>
          {curMember?.grade > 2 && !curMember?.is_admin && (
            <li>
              <div className="info_flex_one">
                <p className="info_subtitle">소속 반</p>
                <p className="info_data_text">{curMember?.class_name ?? ""}</p>
              </div>
            </li>
          )}
        </>
      );
    else
      return (
        <>
          <li>
            <div className="info_flex_one">
              <p className="info_subtitle">소속 반</p>
              <p className="info_data_text">{curMember?.class_name ?? " "}</p>
            </div>
          </li>
          <li className={classnames({ change: editState.name })}>
            <div className="info_flex_one">
              <p className="info_subtitle">원아</p>

              {editState.name ? (
                <div>
                  <div>
                    <input
                      type="text"
                      name="name"
                      className={
                        "info_input account_input request_input " +
                        classnames({ warning: error?.name })
                      }
                      placeholder="이름"
                      value={inputs.name}
                      onChange={handleChange}
                    />
                    {error?.name && (
                      <p className="warning_text wr_account">
                        이름을 입력해주세요.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="info_btn account_save"
                    disabled={!inputs?.name}
                    onClick={() => handleEditKid("name")}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <p className="info_data_text">{familyData?.kid?.name ?? ""}</p>
              )}
            </div>
            {curMember?.grade <= 5 && (
              <div className="info_flex_two">
                <a
                  className="information_change"
                  onClick={(e) => handleEditState(e, "name")}
                >
                  {editState.name ? "취소" : "변경"}
                </a>
              </div>
            )}
          </li>

          <li className={classnames({ change: editState.birth })}>
            <div className="info_flex_one">
              <p className="info_subtitle">생일</p>

              {editState.birth ? (
                <div>
                  <div>
                    <div
                      className={
                        "date_input_box request_input " +
                        classnames({
                          warning:
                            error?.birthYear ||
                            error?.birthMonth ||
                            error?.birthDate,
                        })
                      }
                    >
                      <input
                        type="text"
                        name="birthYear"
                        className="date_input_text"
                        placeholder="출생연도"
                        value={inputs.birthYear}
                        onChange={handleChange}
                        maxLength={4}
                      />
                      <input
                        type="text"
                        name="birthMonth"
                        className="date_input_text"
                        placeholder="월"
                        value={inputs.birthMonth}
                        onChange={handleChange}
                        maxLength={2}
                      />
                      <input
                        type="text"
                        name="birthDate"
                        className="date_input_text"
                        placeholder="일"
                        value={inputs.birthDate}
                        onChange={handleChange}
                        maxLength={2}
                      />
                    </div>
                    {(error?.birthYear ||
                      error?.birthMonth ||
                      error?.birthDate) && (
                      <p className="warning_text wr_account">
                        유효한 날짜를 입력해주세요.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="info_btn account_save"
                    disabled={
                      error?.birthYear || error?.birthMonth || error?.birthDate
                    }
                    onClick={() => handleEditKid("birth")}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <p className="info_data_text">
                  {`${year}년 ${month}월 ${date}일`}
                </p>
              )}
            </div>
            {curMember?.grade <= 5 && (
              <div className="info_flex_two">
                <a
                  className="information_change"
                  onClick={(e) => handleEditState(e, "birth")}
                >
                  {editState.birth ? "취소" : "변경"}
                </a>
              </div>
            )}
          </li>

          <li className={classnames({ change: editState.gender })}>
            <div className="info_flex_one">
              <p className="info_subtitle">성별</p>
              <p className="info_data_text">
                {(() => {
                  const gender = familyData?.kid?.gender;
                  return gender === 0 ? "남" : "여";
                })()}
              </p>
              {editState.gender && (
                <div>
                  <div className="radio_box">
                    <input
                      type="radio"
                      name="gender"
                      id="gender1"
                      className="lulla_radio"
                      checked={inputs?.gender === 1}
                      onChange={() => setInputs({ ...inputs, gender: 1 })}
                    />
                    <label htmlFor="gender1">여</label>

                    <input
                      type="radio"
                      name="gender"
                      id="gender2"
                      className="lulla_radio"
                      checked={inputs?.gender === 0}
                      onChange={() => setInputs({ ...inputs, gender: 0 })}
                    />
                    <label htmlFor="gender2">남</label>
                  </div>
                  <button
                    type="button"
                    className="info_btn account_save"
                    onClick={() => handleEditKid("gender")}
                  >
                    저장
                  </button>
                </div>
              )}
            </div>
            {curMember?.grade <= 5 && (
              <div className="info_flex_two">
                <a
                  className="information_change"
                  onClick={(e) => handleEditState(e, "gender")}
                >
                  {editState.gender ? "취소" : "변경"}
                </a>
              </div>
            )}
          </li>
          <li>
            <div className="info_flex_one">
              <p className="info_subtitle">보호자</p>
              <p className="info_data_text">{curMember?.relation ?? ""}</p>
            </div>
          </li>
          <li>
            <div className="info_flex_one">
              <p className="info_subtitle">이름</p>
              <p className="info_data_text">{curMember?.nickname ?? ""}</p>
            </div>
          </li>
          {familyData?.famliy?.map((v, i) => (
            <li key={v.id}>
              <div className="info_flex_one">
                <p className="info_subtitle">가족{i + 1}</p>
                <p className="info_data_text">{v.relation}</p>
              </div>
            </li>
          ))}
        </>
      );
  }, [curMember, familyData, editState, inputs]);

  return (
    <div className="lulla_information">
      <div className="information_title">
        <p>계정 정보</p>
      </div>
      <ul className="information_list">{infoList}</ul>
    </div>
  );
});

const AccountInfo = (props) => <AccountInfoComponent {...props} />;
export default AccountInfo;
