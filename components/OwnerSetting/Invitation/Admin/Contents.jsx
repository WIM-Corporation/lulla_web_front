import { useState } from "react";
import classnames from "classnames";
import useInput from "@/lib/hooks/useInput";
import { onChangeCondition } from "@/lib/InputUtil";
import { observer } from "mobx-react-lite";
import regex from "@/assets/regex";
import { useOpen } from "@/lib/hooks/useOpen";
import { req } from "@/lib/apiUtil";
import useStores from "@/stores/useStores";
import { useEffect } from "react";
import CancelPopup from "../CancelPopup";
import RetryPopup from "../RetryPopup";
import AdminRow from "./AdminRow";

const Contents = observer(() => {
  const { authStore, globalStore } = useStores();
  const curMember = authStore.curMember;

  const { ref, open, setOpen } = useOpen("ul");
  const [selected, setSelected] = useState(null);
  const [inviteStatus, setInviteStatus] = useState({
    loading: false,
    error: false,
  });
  const [inviteeList, setInviteeList] = useState([]);

  const [popupOpen, setPopupOpen] = useState(initialPopupOpen);

  const handleClickOption = (e, value) => {
    if (!value) return;
    setSelected(value);
    setOpen(false);
  };

  const { inputs, setInputs, handleChange, error, setError } = useInput(
    {
      role: "",
      phoneNumber: "",
    },
    {
      onChangeCondition,
      cb: ({ name, value }) => {
        const isEmpty = name === "phoneNumber" && value === "";
        const regexValid = name === "phoneNumber" && !regex.phone.test(value);
        if (isEmpty || regexValid)
          setError({
            ...error,
            phoneNumber: isEmpty
              ? "번호를 입력해주세요."
              : regexValid
              ? "번호를 다시 확인해주세요."
              : "",
          });
      },
    }
  );

  const handleInvite = async (e) => {
    if (
      !(
        (selected === "직접 입력" && inputs.role) ||
        (selected && selected !== "직접 입력")
      ) ||
      !inputs.phoneNumber
    )
      return;
    console.log(inviteStatus);
    if (!inviteStatus.loading) {
      setInviteStatus({ ...inviteStatus, loading: true });
      const res = await req(
        "/api/v1/invite/admin",
        {
          method: "post",
          data: {
            member_id: curMember?.id,
            phone: inputs.phoneNumber.replaceAll("-", ""),
            role_name: selected === "직접 입력" ? inputs.role : selected,
          },
        },
        authStore.authToken
      ).catch((err) => console.warn(err));

      if (res && res.data.resultCode > 0) {
        globalStore.setToastActive("초대장이 발송되었습니다.");
        getInviteeList();
      }
      setInviteStatus({ ...inviteStatus, loading: false });
    }
  };

  const getInviteeList = async () => {
    const res = await req(
      "/api/v1/invite/list/admin",
      {
        method: "post",
        data: {
          member_id: curMember?.id,
        },
      },
      authStore.authToken
    ).catch((err) => console.warn(err));

    if (res && res.data.resultCode > 0) {
      console.log(res.data.data);
      setInviteeList(res.data.data.invite_list);
    }
  };

  useEffect(() => {
    if (authStore.isMemberLoaded) getInviteeList();
  }, [authStore.isMemberLoaded]);

  return (
    <>
      <main className="admin_box">
        <div className="adm_box">
          <div className="adm_header2">
            <p className="adm_title">관리자</p>
            <p className="adm_subtext">
              관리자 초대 시 원 운영을 위한 반 설정이 할 수 있고 선생님과 원아의
              초대/승인/탈퇴, 그리고 게시글을 관리할 수 있습니다. <br />
              초대 이후 재초대가 가능하며 초대를 취소할 경우 해당 문자를 받은
              대상은 초대 가입을 할 수 없습니다. <br />
              *원 관리와 관리자 초대에 대한 권한은 제외됩니다.
            </p>
          </div>
          <section className="sec_2">
            <div className="adm_input_box">
              <ul className="adm_inputList">
                <li className="adm_inputItem" style={{ gap: 20 }}>
                  <div
                    className={classnames({
                      adm_selectBox: true,
                      on: open,
                    })}
                    onClick={() => setOpen(!open)}
                  >
                    <div className="adm_valueBox">
                      <div className="adm_select_value">
                        {selected ?? "역할 선택"}
                      </div>
                    </div>
                    {open && (
                      <ul ref={ref} className="adm_select_list">
                        <li
                          className="adm_select_item"
                          onClick={(e) => handleClickOption(e, "원감")}
                        >
                          <p>원감</p>
                        </li>
                        <li
                          className="adm_select_item"
                          onClick={(e) => handleClickOption(e, "주임")}
                        >
                          <p>주임</p>
                        </li>
                        <li
                          className="adm_select_item"
                          onClick={(e) => handleClickOption(e, "직접 입력")}
                        >
                          <p>직접 입력</p>
                        </li>
                      </ul>
                    )}
                  </div>

                  <div className="adm_inputBox">
                    <input
                      type="text"
                      className="info_input"
                      disabled={selected !== "직접 입력"}
                      name="role"
                      value={inputs?.role}
                      onChange={handleChange}
                      placeholder="직접 입력"
                      // onFocus={(e) => {
                      //   e.target.placeholder = "";
                      // }}
                      // onBlur={(e) => (e.target.placeholder = "직접 입력")}
                    />
                  </div>
                </li>

                <li className="adm_inputItem">
                  <input
                    type="text"
                    className={classnames({
                      info_input: true,
                      adm_warning: error.phoneNumber,
                    })}
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    onChange={handleChange}
                    placeholder="휴대폰 번호"
                  />
                  {error.phoneNumber && (
                    <p className="warning_text2">{error.phoneNumber}</p>
                  )}
                </li>
              </ul>
              <ul className="adm_inputList2">
                <li className="adm_inputItem2">
                  <button
                    type="button"
                    className="invite_cancle_B invite_btn"
                    disabled={
                      !selected ||
                      (selected === "직접 입력" && !inputs.role) ||
                      !inputs.phoneNumber ||
                      error.phoneNumber
                    }
                    onClick={() => setInputs({ ...inputs, phoneNumber: "" })}
                  >
                    취소
                  </button>
                </li>
                <li className="adm_inputItem2">
                  <button
                    type="button"
                    className="invite_ok_btn invite_btn"
                    disabled={
                      !selected ||
                      (selected === "직접 입력" && !inputs.role) ||
                      !inputs.phoneNumber ||
                      error.phoneNumber
                    }
                    onClick={handleInvite}
                  >
                    초대
                  </button>
                </li>
              </ul>
            </div>

            <div className="adm_bodyBox">
              <div className="adm_tabBox">
                <div className="adm_tab on">
                  <p>초대 중</p>
                </div>
              </div>
              <div className="adm_table">
                <div className="adm_thead">
                  <div className="adm_row">
                    <div className="adm_th">
                      <p className="tbl_center">역할</p>
                    </div>
                    <div className="adm_th">
                      <p>
                        초대일
                        <a className="sortable_box">
                          <img src="/imgs/icon-down-fill-grey-t.png" />
                        </a>
                      </p>
                    </div>
                    <div className="adm_th">
                      <p>휴대폰 번호</p>
                    </div>
                    <div className="adm_th">
                      <p></p>
                    </div>
                  </div>
                </div>

                <div className="adm_tbody">
                  {inviteeList
                    ?.filter((v) => v.type <= 2)
                    .map((v) => {
                      const convertedTime = new Date(
                        new Date(v.created_utc).valueOf() +
                          new Date().getTimezoneOffset() * 60 * 1000
                      );
                      const createdAt = [
                        convertedTime.getFullYear(),
                        convertedTime.getMonth() + 1 < 10
                          ? "0" + (convertedTime.getMonth() + 1)
                          : convertedTime.getMonth() + 1,
                        convertedTime.getDate() < 10
                          ? "0" + convertedTime.getDate()
                          : convertedTime.getDate(),
                      ].join(".");
                      return (
                        <AdminRow
                          key={v.id}
                          role={v.role_name}
                          createdAt={createdAt}
                          phone={v.phone.replace(regex.phoneFormat, "$1-$2-$3")}
                          onCancel={() =>
                            setPopupOpen({
                              ...popupOpen,
                              type: "cancel",
                              invite_id: v.id,
                            })
                          }
                          onRetry={() =>
                            setPopupOpen({
                              type: "retry",
                              invite_id: v.id,
                            })
                          }
                        />
                      );
                    })}
                </div>
              </div>
              {inviteeList?.length === 0 && (
                <div className="adm_noneBox">
                  <p>등록된 관리자가 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <CancelPopup
        isOpen={popupOpen.type === "cancel" && popupOpen.invite_id}
        onClose={() => setPopupOpen(initialPopupOpen)}
        inviteId={popupOpen.invite_id}
        cb={() => getInviteeList()}
      />
      <RetryPopup
        isOpen={popupOpen.type === "retry" && popupOpen.invite_id}
        onClose={() => setPopupOpen(initialPopupOpen)}
        inviteId={popupOpen.invite_id}
        phone={popupOpen.phone}
        role_name={popupOpen.role_name}
        cb={() => getInviteeList()}
      />
      <style jsx>{`
        .adm_selectBox {
          cursor: pointer;
        }
      `}</style>
    </>
  );
});

const AdminContents = (props) => <Contents {...props} />;
export default AdminContents;

const initialPopupOpen = {
  type: null,
  invite_id: "",
};
