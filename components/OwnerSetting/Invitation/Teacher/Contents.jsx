import { useEffect, useState } from "react";
import classnames from "classnames";
import useInput from "@/lib/hooks/useInput";
import { onChangeCondition } from "@/lib/InputUtil";
import { observer } from "mobx-react-lite";
import useStores from "@/stores/useStores";
import { idGenerator } from "@/lib/CommonUtils";
import regex from "@/assets/regex";
import { req } from "@/lib/apiUtil";
import { useOpen } from "@/lib/hooks/useOpen";
import CancelPopup from "../CancelPopup";
import RetryPopup from "../RetryPopup";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/lib/hooks/usePagination";

const Contents = observer(() => {
  const router = useRouter();
  const { tab = "invite", pageNumber } = router.query ?? {};
  const { authStore, globalStore } = useStores();
  const curMember = authStore.curMember;

  const [options, setOptions] = useState(null);
  const [selected, setSelected] = useState(null);
  const [inviteStatus, setInviteStatus] = useState({
    loading: false,
    error: false,
  });
  const [inviteeList, setInviteeList] = useState([]);
  const [demandList, setDemandList] = useState([]);
  const [popupOpen, setPopupOpen] = useState(initialPopupOpen);

  /** hooks */
  const { ref, open, setOpen } = useOpen("ul");
  const { page, lastPage, handlePage } = usePagination({
    initialPage: pageNumber ?? 1,
    totalCount: tab === "invite" ? inviteeList.length : demandList.length,
    limit: 10,
    cb: (nextPage) =>
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, pageNumber: nextPage },
      }),
  });
  const { inputs, setInputs, handleChange, error, setError, reset } = useInput(
    {
      phoneNumber: "",
    },
    {
      onChangeCondition,
      cb: ({ name, value }) => {
        const isEmpty = value === "";
        const regexValid = !regex.phone.test(value);
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

  const handleOpenOption = async () => {
    if (!options) {
      const res = await req("/api/v1/class/list", {
        method: "post",
        data: {
          school_id: curMember.school_id,
        },
      }).catch((err) => console.warn(err));

      if (res)
        setOptions(
          res.data?.data?.class_list.sort((a, b) =>
            a.name > b.name ? 1 : a.name < b.name ? -1 : 0
          ) ?? null
        );
    }
    setOpen(!open);
  };

  const handleClickOption = (e, value) => {
    if (!value) return;
    setSelected(value);
    setOpen(false);
  };

  const handleInvite = async (e) => {
    if (!selected && inputs.phoneNumber) return;
    if (!inviteStatus.loading) {
      setInviteStatus({ ...inviteStatus, loading: true });
      const res = await req(
        "/api/v1/invite/teacher",
        {
          method: "post",
          data: {
            member_id: curMember?.id,
            class_id: selected?.id,
            phone: inputs.phoneNumber.replaceAll("-", ""),
          },
        },
        authStore.authToken
      ).catch((err) => console.warn(err));
      if (res && res.data.resultCode > 0) {
        globalStore.setToastActive("초대장이 발송되었습니다.");
        reset();
        setSelected(null);
      }
      setInviteStatus({ ...inviteStatus, loading: false });
    }
  };

  const handleTab = async (target = tab) => {
    if (tab !== target)
      router.push({
        pathname: "/owner_setting/invitation/teacher",
        query: { ...router.query, tab: target },
      });
    if (target === "invite") {
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
        setInviteeList(
          res.data.data.invite_list
            ?.filter((v) => v?.type === 3 || v?.role_type === 3)
            .sort(
              (a, b) =>
                new Date(b.created_utc).valueOf() -
                new Date(a.created_utc).valueOf()
            )
        );
      }
    } else if (target === "approve") {
      const res = await req(
        "/api/v1/demand/list",
        {
          method: "post",
          data: {
            member_id: curMember?.id,
            type: 3, // role type
            confirmed: false,
            is_denied: false,
          },
        },
        authStore.authToken
      ).catch((err) => console.warn(err));
      if (res && res.data.resultCode > 0) {
        setDemandList(
          res.data.data.demand_list
            ?.filter((v) => v?.type === 3 || v?.role_type === 3)
            .sort(
              (a, b) =>
                new Date(b.created_utc).valueOf() -
                new Date(a.created_utc).valueOf()
            )
        );
      }
    }
  };

  useEffect(() => {
    if (authStore.isMemberLoaded) handleTab();
  }, [authStore.isMemberLoaded]);

  return (
    <>
      <main className="admin_box">
        <div className="adm_box">
          <div className="adm_header2">
            <p className="adm_title">선생님</p>
            <p className="adm_subtext">
              반 운영을 책임지는 담임 선생님을 초대합니다. <br />
              초대 이후 재초대가 가능하며 초대를 취소할 경우 해당 문자를 받은
              대상은 초대 가입을 할 수 없습니다.
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
                    onClick={handleOpenOption}
                  >
                    <div className="adm_valueBox">
                      <div className="adm_select_default">
                        {selected?.name ?? "반 선택"}
                      </div>
                    </div>
                    {open && (
                      <ul ref={ref} className="adm_select_list">
                        {options?.map((classList) => (
                          <li
                            key={idGenerator()}
                            className="adm_select_item"
                            onClick={(e) => handleClickOption(e, classList)}
                          >
                            <p>{classList.name}</p>
                          </li>
                        ))}
                      </ul>
                    )}
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
                  {error?.phoneNumber && (
                    <p className="warning_text2">{error.phoneNumber}</p>
                  )}
                </li>
              </ul>
              <ul className="adm_inputList2">
                <li className="adm_inputItem2">
                  <button
                    type="button"
                    className="invite_cancle_B invite_btn"
                    disabled={!(selected && inputs.phoneNumber)}
                    onClick={() => setInputs({ ...inputs, phoneNumber: "" })}
                  >
                    취소
                  </button>
                </li>
                <li className="adm_inputItem2">
                  <button
                    type="button"
                    href=""
                    className="invite_ok_btn invite_btn"
                    disabled={
                      !(selected && inputs.phoneNumber && !error.phoneNumber)
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
                <div
                  className={classnames({
                    adm_tab: true,
                    on: tab === "invite",
                  })}
                  aria-describedby="invite"
                  onClick={() => handleTab("invite")}
                >
                  <p>초대 중</p>
                </div>
                <div
                  className={classnames({
                    adm_tab: true,
                    on: tab === "approve",
                  })}
                  aria-describedby="approve"
                  onClick={() => handleTab("approve")}
                >
                  <p>승인 요청</p>
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
                        소속
                        <a className="sortable_box">
                          <img src="/imgs/icon-down-fill-grey-t.png" />
                        </a>
                      </p>
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
                  {(tab === "invite" ? inviteeList : demandList)
                    ?.filter((_, i) => i >= (page - 1) * 10 && i < page * 10)
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
                        <TeacherRow
                          type={tab}
                          key={v.id}
                          role="선생님"
                          className={v.class_name}
                          createdAt={createdAt}
                          phone={(v?.phone ?? "").replace(
                            regex.phoneFormat,
                            "$1-$2-$3"
                          )}
                          onCancel={() =>
                            setPopupOpen({
                              type: "cancel",
                              invite_id: tab === "invite" ? v.id : "",
                              demand_id: tab === "approve" ? v.id : "",
                            })
                          }
                          onRetry={() =>
                            setPopupOpen({
                              type: "retry",
                              invite_id: tab === "invite" ? v.id : "",
                              demand_id: tab === "approve" ? v.id : "",
                            })
                          }
                        />
                      );
                    })}
                </div>
              </div>

              {((tab === "invite" && inviteeList.length === 0) ||
                (tab === "approve" && demandList.length === 0)) && (
                <div className="adm_noneBox">
                  <p>등록된 선생님이 없습니다.</p>
                </div>
              )}
              {((tab === "invite" && inviteeList.length > 0) ||
                (tab === "approve" && demandList.length > 0)) && (
                <Pagination
                  page={page}
                  lastPage={lastPage}
                  handlePage={handlePage}
                />
              )}
            </div>
          </section>
        </div>
      </main>
      <CancelPopup
        isOpen={
          popupOpen.type === "cancel" &&
          ((tab === "invite" && popupOpen.invite_id) ||
            (tab === "approve" && popupOpen.demand_id))
        }
        onClose={() => setPopupOpen(initialPopupOpen)}
        inviteId={popupOpen.invite_id}
        demandId={popupOpen.demand_id}
        cb={() => handleTab(tab)}
      />
      <RetryPopup
        isOpen={
          popupOpen.type === "retry" &&
          ((tab === "invite" && popupOpen.invite_id) ||
            (tab === "approve" && popupOpen.demand_id))
        }
        onClose={() => setPopupOpen(initialPopupOpen)}
        inviteId={popupOpen.invite_id}
        demandId={popupOpen.demand_id}
        cb={() => handleTab(tab)}
      />
      <style jsx>{`
        .adm_selectBox,
        .adm_tab {
          cursor: pointer;
        }
      `}</style>
    </>
  );
});

const TeacherContents = (props) => <Contents {...props} />;
export default TeacherContents;

const TeacherRow = ({
  type,
  className,
  role,
  createdAt,
  phone,
  onCancel,
  onRetry,
}) => {
  return (
    <div className="adm_row">
      <div className="adm_td">
        <p className="tbl_center">{role}</p>
      </div>
      <div className="adm_td">
        <p>{className}</p>
      </div>
      <div className="adm_td">
        <p>{createdAt}</p>
      </div>
      <div className="adm_td">
        <p>{phone}</p>
      </div>
      <div className="adm_td">
        <div className="btn_box">
          <a className="invite_X invite_request_btn" onClick={onCancel}>
            {type === "invite" ? "초대 취소" : "승인 거절"}
          </a>
          <a className="invite_R invite_request_btn" onClick={onRetry}>
            {type === "invite" ? "재초대" : "가입 승인"}
          </a>
        </div>
      </div>
    </div>
  );
};

const initialPopupOpen = {
  type: null,
  invite_id: "",
  demand_id: "",
};
