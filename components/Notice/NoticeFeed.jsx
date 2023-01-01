import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NoticeFeedComponent = observer(() => {
  const router = useRouter();
  const { authStore } = useStores();
  const curMember = authStore.curMember;
  const isMemberLoaded = authStore.isMemberLoaded;

  return (
    <>
      <main>
        <section className="sec_4">
          <div className="flex_box post_box">
            <div className="left_post_box">
              <p className="post_box_title">공지사항</p>

              {curMember?.grade <= 2 && (
                <div className="post_write_box">
                  <div className="post_info_box">
                    <div className="post_member_img">
                      <img src="/imgs/icon-profile-fill-xl.png" />
                    </div>
                    <div className="post_write_input">
                      <input
                        type="text"
                        className="post_input"
                        placeholder="어떤 공지를 게시할까요?"
                      />
                    </div>
                  </div>

                  <div className="post_btn_box">
                    <button type="button" className="post_btn">
                      글쓰기
                    </button>
                  </div>
                </div>
              )}

              <div className="post_view_box">
                <div className="post_view_top_box">
                  <div className="post_info_box">
                    <div className="post_member_img">
                      <img src="/imgs/icon-profile-fill-xl.png" />
                    </div>
                    <div className="post_member_info_box">
                      <p className="post_member_name">랄라</p>
                      <p className="post_update_time">방금</p>
                    </div>

                    {/* <div className="profile_dropBox">
                    <div className="pf_head">
                      <img src="/imgs/profile-m.png" />
                    </div>
                    <div className="pf_textBox">
                      <p>해바라기반 채성아 선생님</p>
                      <p>해바라기반 채성아 선생님입니다.</p>
                    </div>
                    <div className="pf_messageBox">
                      <img src="/imgs/icon-chat-fill-grey-s.png" />
                    </div>
                  </div> */}
                  </div>

                  {/* <div className="post_btn_box">
                    <div className="more_btn">
                      <img src="/imgs/icon-more-fill-grey-s.png" />
                    </div>
                  </div> */}
                </div>

                <div className="post_view_body">
                  <p className="post_main_text">
                    <span className="post_title">축하합니다!</span>
                    이제 랄라를 마음껏 활용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="right_post_box">
              <div className="post_side_box"></div>
              <div className="post_side_box"></div>
            </div>
          </div>
        </section>
      </main>
      <style jsx>{`
        main {
          height: 100%;
        }
      `}</style>
    </>
  );
});

const NoticeFeed = (props) => <NoticeFeedComponent {...props} />;
export default NoticeFeed;
