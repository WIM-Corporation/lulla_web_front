import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import { idGenerator } from "@/lib/CommonUtils";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";

const Append = observer((props) => {
  const router = useRouter();
  const { authStore } = useStores();
  const loading = authStore.isMemberLoaded;
  const memberList = authStore.memberList.filter(
    (member) => member.id !== authStore.curMember?.id
  );

  if (!loading) {
    return <></>;
  }

  return (
    <>
      <div className="Wrap side_layout">
        <AccountNav />
        <div className="container">
          <NavHeader />
          <main className="admin_box">
            <div className="adm_box2">
              <div className="adm_header2 account_plusHd">
                <p className="adm_title">계정 추가</p>
                <div className="account_plusBtn">
                  <button
                    type="button"
                    className="ac_plusBtn"
                    onClick={() => router.push("/member/append/select")}
                  >
                    계정 추가
                  </button>
                </div>
              </div>

              <div className="account_plusBody">
                <p className="plus_top_title">사용 중 계정</p>
                {memberList.length === 0 ? (
                  <div className="adm_noneBox2">
                    <p>사용 중인 다른 계정이 없습니다.</p>
                  </div>
                ) : (
                  <div className="ac_plusListbox">
                    {memberList?.map((member) => (
                      <div key={idGenerator()} className="ac_plus_item">
                        <div className="ac_plus_member">
                          <div className="ac_plus_memberImg">
                            <img
                              className="profile"
                              src={
                                member?.member_image ??
                                "/imgs/icon-profile-fill-circle-m.png"
                              }
                            />
                          </div>

                          <p className="ac_plus_name">
                            {member.member_nickname}
                            {member?.grade === 1 && (
                              <span className="certification">
                                <img src="/imgs/badge.png" />
                              </span>
                            )}
                            <span>{member?.School?.name}</span>
                          </p>
                        </div>
                        <div
                          className="ac_plus_change"
                          onClick={() => {
                            router.prefetch("/notice");
                            authStore.setCurrentMember(member.id);
                            router.push("/notice");
                          }}
                        >
                          <p>계정 전환</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <style jsx>{`
        img.profile {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid #ccc;
        }

        .admin_box {
          padding: 16px 32px;
        }

        .certification {
          display: inline-block;
        }

        .certification > img {
          vertical-align: bottom;
        }
      `}</style>
    </>
  );
});

const Index = (props) => <Append {...props} />;
export default Index;
