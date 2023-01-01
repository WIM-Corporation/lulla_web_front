import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { req } from "@/lib/apiUtil";

export const DefaultNavComponent = observer(() => {
  const router = useRouter();
  const { authStore } = useStores();
  const curMember = authStore?.curMember;
  const [classList, setClassList] = useState([]);
  const [toggle, setToggle] = useState({
    notice: false,
    album: false,
    alram: false,
    tuyak: false,
    won: router.asPath.startsWith("/owner_setting"),
    won_two_depth1: false,
    won_two_depth2: router.asPath.startsWith("/owner_setting/invitation"),
  });

  const handleToggle = (new_toggle) => {
    setToggle({ ...toggle, [new_toggle]: !toggle[new_toggle] });
  };

  useEffect(() => {
    const getClassList = async () => {
      const res = await req("/api/v1/class/list", {
        method: "post",
        data: {
          school_id: curMember.School.id,
        },
      }).catch((err) => console.warn(err));

      if (res && res.data.resultCode > 0) {
        // console.log(res.data.data.class_list);
        setClassList(res.data.data.class_list);
      }
    };
    if (curMember) {
      getClassList();
    }
  }, [curMember]);

  return (
    <>
      <nav>
        <Link href="/" passHref>
          <a className="logo main_logo">
            <img src="/imgs/logo.png" />
          </a>
        </Link>
        <ul className="lnb_box">
          <li
            className={classnames({
              active: router.pathname.startsWith("/home"),
              lnb_list: true,
            })}
          >
            <Link href="" passHref>
              <a className="main_menu one_depth">
                <img src="/imgs/icon-home-fill-teal-s-bold.png" />
                <span style={{ width: 24 }}></span>
                <span className="no_depth">홈</span>
              </a>
            </Link>
          </li>
          <li
            className={classnames({
              active: router.pathname.startsWith("/notice"),
              lnb_list: true,
            })}
            onClick={() => {
              router.push("/notice");
            }}
          >
            <Link href="" passHref>
              <a className="main_menu one_depth">
                <img src="/imgs/icon-notice-fill-teal-s-bold.png" />
                {classList.length === 0 || curMember?.grade >= 5 ? (
                  <span style={{ width: 24 }}></span>
                ) : !toggle.notice ? (
                  <img
                    className="toggle"
                    src="/imgs/icon-right-fill-grey-t.png"
                    onClick={() => handleToggle("notice")}
                  />
                ) : (
                  <img
                    className="toggle_active"
                    src="/imgs/icon-down-fill-t.png"
                    onClick={() => handleToggle("notice")}
                  />
                )}
                <span className="depth_name notice_name">공지사항</span>
              </a>
            </Link>

            {toggle.notice && (
              <ul className="two_depth_list">
                {classList.map((v) => (
                  <li key={v.id} className="two_depth_item">
                    <Link href="" passHref>
                      <a className="no_depth">
                        <span className="depth_span_name">{v.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li
            className={classnames({
              active: router.pathname.startsWith("/album"),
              lnb_list: true,
            })}
          >
            <a href="#" className="main_menu one_depth">
              <img src="/imgs/icon-gallery-fill-teal-s-bold.png" />
              {classList.length === 0 || curMember?.grade >= 5 ? (
                <span style={{ width: 24 }}></span>
              ) : !toggle.album ? (
                <img
                  className="toggle"
                  src="/imgs/icon-right-fill-grey-t.png"
                  onClick={() => handleToggle("album")}
                />
              ) : (
                <img
                  className="toggle_active"
                  src="/imgs/icon-down-fill-t.png"
                  onClick={() => handleToggle("album")}
                />
              )}
              <span className="depth_name album">앨범</span>
            </a>

            {toggle.album && (
              <ul className="two_depth_list">
                {classList.map((v) => (
                  <li key={v.id} className="two_depth_item">
                    <Link href="" passHref>
                      <a className="no_depth">
                        <span className="depth_span_name">{v.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li
            className={classnames({
              active: router.pathname.startsWith("/alrim"),
              lnb_list: true,
            })}
          >
            <a href="#" className="main_menu one_depth">
              <img src="/imgs/icon-homework-fill-teal-s-bold.png" />
              {classList.length === 0 || curMember?.grade >= 5 ? (
                <span style={{ width: 24 }}></span>
              ) : !toggle.alram ? (
                <img
                  className="toggle"
                  src="/imgs/icon-right-fill-grey-t.png"
                  onClick={() => handleToggle("alram")}
                />
              ) : (
                <img
                  className="toggle_active"
                  src="/imgs/icon-down-fill-t.png"
                  onClick={() => handleToggle("alram")}
                />
              )}
              <span className="depth_name alrim">알림장</span>
            </a>

            {toggle.alram && (
              <ul className="two_depth_list">
                {classList.map((v) => (
                  <li key={v.id} className="two_depth_item">
                    <Link href="" passHref>
                      <a className="no_depth">
                        <span className="depth_span_name">{v.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li
            className={classnames({
              active: router.pathname.startsWith("/tuyak"),
              lnb_list: true,
            })}
          >
            <a href="#" className="main_menu one_depth">
              <img src="/imgs/icon-pill-fill-teal-s-bold.png" />
              {classList.length === 0 || curMember?.grade >= 5 ? (
                <span style={{ width: 24 }}></span>
              ) : !toggle.tuyak ? (
                <img
                  className="toggle"
                  src="/imgs/icon-right-fill-grey-t.png"
                  onClick={() => handleToggle("tuyak")}
                />
              ) : (
                <img
                  className="toggle_active"
                  src="/imgs/icon-down-fill-t.png"
                  onClick={() => handleToggle("tuyak")}
                />
              )}
              <span className="depth_name tuyak">투약의뢰서</span>
            </a>

            {toggle.tuyak && (
              <ul className="two_depth_list">
                {classList.map((v) => (
                  <li key={v.id} className="two_depth_item">
                    <Link href="" passHref>
                      <a className="no_depth">
                        <span className="depth_span_name">{v.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {curMember?.grade <= 2 && (
            <li
              className={classnames({
                lnb_list: true,
                disabled: !curMember?.is_admin,
                active: router.pathname === "/owner_setting",
              })}
            >
              <Link href="/owner_setting" passHref>
                <a className="main_menu one_depth">
                  <img src="/imgs/icon-school-fill-teal-s-bold.png" />
                  {!toggle.won ? (
                    <img
                      className="toggle"
                      src="/imgs/icon-right-fill-grey-t.png"
                      onClick={() => handleToggle("won")}
                    />
                  ) : (
                    <img
                      className="toggle_active"
                      src="/imgs/icon-down-fill-t.png"
                      onClick={() => handleToggle("won")}
                    />
                  )}
                  <span className="depth_name won">원 관리</span>
                </a>
              </Link>
              {toggle.won && (
                <ul className="two_depth_list">
                  {curMember?.grade <= 1 && (
                    <li
                      className={classnames({
                        two_depth_item: true,
                        depth_on: router.pathname === "/owner_setting/school",
                      })}
                    >
                      <Link href="/owner_setting/school" passHref>
                        <a className="no_depth">
                          <span className="depth_span_name">원</span>
                        </a>
                      </Link>
                    </li>
                  )}
                  <li className="two_depth_item">
                    <Link href="/owner_setting/class" passHref>
                      <a className="no_depth">
                        <span className="depth_span_name">반</span>
                      </a>
                    </Link>
                  </li>
                  <li className="two_depth_item">
                    <a
                      href="#"
                      className="depth_name"
                      style={{ marginLeft: -21 }}
                    >
                      {!toggle.won_two_depth1 ? (
                        <img
                          className="toggle"
                          src="/imgs/icon-right-fill-grey-t.png"
                          onClick={() => handleToggle("won_two_depth1")}
                        />
                      ) : (
                        <img
                          className="toggle_active"
                          src="/imgs/icon-down-fill-t.png"
                          onClick={() => handleToggle("won_two_depth1")}
                        />
                      )}
                      <span className="depth_span_name">구성원</span>
                    </a>
                    {toggle.won_two_depth1 && (
                      <ul className="two_depth_list">
                        <li className="thrd_depth_item">
                          <a href="#">
                            <span className="depth_span_name">관리자</span>
                          </a>
                        </li>
                        <li className="thrd_depth_item">
                          <a href="#">
                            <span className="depth_span_name">선생님</span>
                          </a>
                        </li>
                        <li className="thrd_depth_item">
                          <a href="#">
                            <span className="depth_span_name">원아</span>
                          </a>
                        </li>
                        <li className="thrd_depth_item">
                          <a href="#">
                            <span className="depth_span_name">비활성 계정</span>
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="two_depth_item">
                    <a
                      onClick={(e) => e.stopPropagation()}
                      className="depth_name"
                      style={{ marginLeft: -21 }}
                    >
                      {!toggle.won_two_depth2 ? (
                        <img
                          className="toggle"
                          src="/imgs/icon-right-fill-grey-t.png"
                          onClick={() => handleToggle("won_two_depth2")}
                        />
                      ) : (
                        <img
                          className="toggle_active"
                          src="/imgs/icon-down-fill-t.png"
                          onClick={() => handleToggle("won_two_depth2")}
                        />
                      )}
                      <span className="depth_span_name">초대 및 승인</span>
                    </a>
                    {toggle.won_two_depth2 && (
                      <ul className="two_depth_list">
                        <li
                          className={classnames({
                            thrd_depth_item: true,
                            active: router.pathname.startsWith(
                              "/owner_setting/invitation/admin"
                            ),
                          })}
                        >
                          <Link href="/owner_setting/invitation/admin" passHref>
                            <a>
                              <span className="depth_span_name">관리자</span>
                            </a>
                          </Link>
                        </li>
                        <li
                          className={classnames({
                            thrd_depth_item: true,
                            active: router.pathname.startsWith(
                              "/owner_setting/invitation/teacher"
                            ),
                          })}
                        >
                          <Link
                            href="/owner_setting/invitation/teacher"
                            passHref
                          >
                            <a>
                              <span className="depth_span_name">선생님</span>
                            </a>
                          </Link>
                        </li>
                        <li className="thrd_depth_item">
                          <a href="#">
                            <span className="depth_span_name">원아</span>
                          </a>
                        </li>
                      </ul>
                    )}
                    <li className="two_depth_item">
                      <a href="#" className="no_depth">
                        <span className="depth_span_name">메뉴관리</span>
                      </a>
                    </li>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        <div className="sibe_copyright">
          <ul>
            <li>
              <Link href="" passHref>
                <a>소개</a>
              </Link>
            </li>
            <li>
              <Link href="" passHref>
                <a>공지사항</a>
              </Link>
            </li>
            <li>
              <Link href="" passHref>
                <a>사용가이드</a>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link href="" passHref>
                <a>개인정보처리방침</a>
              </Link>
            </li>
            <li>
              <Link href="" passHref>
                <a>이용약관</a>
              </Link>
            </li>
          </ul>
          <p className="copyright">© 2022 lulla inc., all rights reserved.</p>
        </div>
      </nav>
      <style jsx>{`
        nav {
          max-height: 100vh;
          position: fixed;
          overflow-y: auto;
        }
        .lnb_box {
          min-height: calc(100vh - 104.5px - 65.15px);
        }
        .lnb_list .main_menu {
          grid-gap: 8px;
        }
        .lnb_list.active {
          background-color: var(--teal10);
          border-radius: 0px 25px 25px 0px;
        }
        .two_depth_item > a {
          display: flex;
          align-items: center;
          padding: 4px 0px 4px 74px;
        }
        .thrd_depth_item > a {
          padding: 8px 0px 8px 74px;
        }
        .depth_name::before {
          content: unset;
        }
        .one_depth:hover {
          background-color: var(--gray10);
          border-radius: 0px 25px 25px 0px;
        }
        .depth_span_name {
          padding: 6px;
        }
        .depth_span_name:hover {
          background-color: var(--gray50);
          border-radius: 8px;
        }
        img.toggle:hover {
          background-color: var(--gray100);
          border-radius: 50%;
        }
        .sibe_copyright {
          position: initial;
        }
      `}</style>
    </>
  );
});

const DefaultNav = () => <DefaultNavComponent />;
export default DefaultNav;
