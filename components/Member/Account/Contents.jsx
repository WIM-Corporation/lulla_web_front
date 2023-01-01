import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import Link from "next/link";
import regex from "@/assets/regex";
import AccountInfo from "./AccountInfo";
import Delete from "./Delete";
import { useState } from "react";
import DeleteCompleteModal from "./DeleteCompleteModal";

const ObserverComponent = observer((props) => {
  const { authStore, globalStore } = useStores();
  const router = useRouter();

  const currentMember = authStore.curMember;
  const schoolInfo = authStore.curMember?.School;
  const [deleteHidden, setDeleteHidden] = useState(true);

  if (!authStore.isMemberLoaded) return <></>;

  return (
    <>
      <main>
        <div className="box_m">
          <div className="title_box account_titlebox">
            <p className="account_title">내 계정</p>
            <div className="account_hd">
              <ul className="hd_section">
                <li>
                  <div className="account_profile">
                    <img
                      src={
                        currentMember && currentMember.member_image
                          ? currentMember.member_image
                          : "/imgs/profile_big.png"
                      }
                      style={{
                        width: 144,
                        height: 144,
                        overflow: "hidden",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>

                  <div className="profile_info_box">
                    <p className="profile_name">
                      {currentMember && currentMember?.member_nickname
                        ? currentMember.member_nickname
                        : "-"}
                      {currentMember?.grade === 1 && (
                        <span className="certification">
                          <img src="/imgs/badge.png" />
                        </span>
                      )}
                    </p>

                    <p className="status">
                      {currentMember && currentMember.description
                        ? currentMember.description
                        : " "}
                    </p>
                  </div>
                </li>
                <li>
                  <Link href="" passHref>
                    <a
                      className="profile_chang"
                      onClick={(e) => {
                        e.preventDefault();
                        globalStore.setProfileEditModalHidden(false);
                      }}
                    >
                      프로필 수정
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <section className="sec_3">
            <div className="lulla_information">
              <div className="information_title">
                <p>원 정보</p>
              </div>
              <ul className="information_list">
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">소속</p>
                    <p className="info_data_text">
                      {schoolInfo && schoolInfo.name ? schoolInfo.name : " "}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">주소</p>
                    <p className="info_data_text">
                      {schoolInfo?.address ?? ""}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">원장님 이름</p>
                    <p className="info_data_text">
                      {schoolInfo?.admin_name ?? ""}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle">원 전화번호</p>
                    <p className="info_data_text">
                      {schoolInfo?.tel.replace(regex.telephone, "$1-$2-$3") ??
                        ""}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <AccountInfo />
            <div
              className="account_delet"
              onClick={() => setDeleteHidden(false)}
            >
              <p>계정 삭제</p>
            </div>
          </section>
        </div>
      </main>
      <Delete hidden={deleteHidden} handleHidden={setDeleteHidden} />
      {/* <DeleteCompleteModal hidden={false} /> */}
      <style jsx>
        {`
          .certification {
            vertical-align: sub;
          }
          .title_box {
            padding: 64px 0px 32px;
            margin: 0;
            width: 100%;
          }
        `}
      </style>
    </>
  );
});

const AccountContents = (props) => <ObserverComponent {...props} />;
export default AccountContents;
