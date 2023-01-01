import { useRouter } from "next/router";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { req } from "@/lib/apiUtil";
import classnames from "classnames";
import { useOpen } from "@/lib/hooks/useOpen";

const ObservableComponent = observer((props) => {
  const router = useRouter();
  const { authStore, globalStore } = useStores();
  const { open, setOpen, ref } = useOpen("div", false, () =>
    globalStore.setProfileChangeModalHidden(true)
  );
  const curMember = authStore.curMember;
  const [demandList, setDemandList] = useState([]);

  const handleClickChangeMember = (e, id) => {
    e.stopPropagation();
    authStore.setCurrentMember(id);
    globalStore.setProfileChangeModalHidden(true);
    router.push("/notice");
  };

  const getDemandList = async () => {
    const res = await req(
      "/api/v1/demand/list/me",
      {
        method: "post",
        data: {
          confirmed: false,
          is_denied: false,
        },
      },
      authStore.authToken
    ).catch((err) => console.warn(err));

    if (!res || res.data.resultCode < 0) return;
    console.log(res.data.data);
    setDemandList(res.data.data.demand_list);
  };

  useEffect(() => {
    if (authStore.isAuth) getDemandList();
  }, [authStore.isAuth]);

  useEffect(() => {
    if (!globalStore.profileChangeModalHidden && !open) setOpen(true);
  }, [globalStore.profileChangeModalHidden]);

  if (!authStore.isMemberLoaded) {
    return <div />;
  }

  return (
    <>
      <div
        className="Wrap"
        hidden={globalStore.profileChangeModalHidden || !open}
      >
        <div className="mask">
          <div className="like_popupBox" ref={ref}>
            <div className="like_header">
              <p>계정 전환</p>
              <div
                className="popup_closeBox"
                onClick={() => globalStore.setProfileChangeModalHidden(true)}
              >
                <img src="/imgs/icon-close-s.png" />
              </div>
            </div>

            <div
              className="like_listBox2"
              style={{
                overflowY: "auto",
              }}
            >
              {authStore.memberList.length == 0 ? (
                <p className="list_noneText">전환할 계정이 없습니다.</p>
              ) : (
                <>
                  {curMember && (
                    <div className="like_member_item">
                      <div className="like_member">
                        <div className="like_member_img">
                          <img
                            src={
                              curMember?.member_image ??
                              "/imgs/icon-profile-fill-xl.png"
                            }
                          />
                        </div>
                        <div className="like_midbox">
                          <p className="like_member_name2">
                            {curMember?.member_nickname}
                            {curMember?.grade === 1 && (
                              <span className="certification">
                                <img src="/imgs/badge.png" />
                              </span>
                            )}
                          </p>
                          {curMember?.grade > 1 && (
                            <p className="like_subtext">
                              {curMember?.School.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="account_changeBox">
                        <img src="/imgs/icon-checkbox-circle-fill-teal-s.png" />
                      </div>
                    </div>
                  )}
                  {authStore.memberList
                    .filter((v) => v.id !== curMember?.id)
                    .map((mItem) => (
                      <div
                        key={mItem.id}
                        className="like_member_item"
                        onClick={(e) => handleClickChangeMember(e, mItem.id)}
                      >
                        <div className="like_member">
                          <div className="like_member_img">
                            <img
                              src={
                                mItem?.member_image ??
                                "/imgs/icon-profile-fill-xl.png"
                              }
                            />
                          </div>
                          <div className="like_midbox">
                            <p
                              className={classnames({
                                like_member_name2: true,
                                on: false,
                              })}
                            >
                              {mItem?.member_nickname}
                              {mItem?.grade === 1 && (
                                <span className="certification">
                                  <img src="/imgs/badge.png" />
                                </span>
                              )}
                            </p>

                            {mItem?.grade > 1 && (
                              <p className="like_subtext">
                                {mItem.School.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {demandList?.map((mItem) => (
                <div
                  key={mItem.id}
                  className="like_member_item"
                  onClick={(e) => {
                    e.stopPropagation();
                    globalStore.setToastActive("승인 대기 중 입니다.");
                  }}
                >
                  <div className="like_member">
                    <div className="like_member_img">
                      <img
                        src={
                          mItem?.member_image ??
                          "/imgs/icon-profile-fill-xl.png"
                        }
                      />
                    </div>
                    <div className="like_midbox">
                      <p
                        className={classnames({
                          like_member_name2: true,
                          on: false,
                        })}
                      >
                        {authStore?.userInfo?.name +
                          `(${
                            mItem.role_type === 3 ? "선생님" : "보호자"
                          } 승인대기)`}
                        {mItem?.grade === 1 && (
                          <span className="certification">
                            <img src="/imgs/badge.png" />
                          </span>
                        )}
                      </p>

                      {mItem?.role_type > 1 && (
                        <p className="like_subtext">{mItem.school_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="account_changeBox2">
                    <p className="change_wait1">승인 대기중</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="tagError_sendBox">
              <button
                type="button"
                className="tagError_sendbtn"
                onClick={() => {
                  router.push("/member/append/select");
                  globalStore.setProfileChangeModalHidden(true);
                }}
              >
                계정 추가
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .popup_closeBox {
          cursor: pointer;
          top: 24px;
        }
        .like_member_img > img {
          border-radius: 5px;
          width: 100%;
          height: 100%;
        }
        .like_member_name2 {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
});

const ChangeProfile = (props) => <ObservableComponent {...props} />;
export default ChangeProfile;
