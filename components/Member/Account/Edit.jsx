import { req } from "@/lib/apiUtil";
import useInput from "@/lib/hooks/useInput";
import { useOpen } from "@/lib/hooks/useOpen";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRef, useState } from "react";

const EditComponent = observer(() => {
  const router = useRouter();
  const { authStore, globalStore } = useStores();
  const hidden = globalStore.profileEditModalHidden;
  const curMember = authStore.curMember;

  const { open, setOpen, ref } = useOpen("ul");
  const initialState = {
    nickname: curMember?.nickname ?? "",
    description: curMember?.description ?? "",
    imageId: curMember?.image_id,
  };

  const { inputs, setInputs, handleChange } = useInput(initialState, {
    onChangeCondition: (name, value) => {
      if (name === "nickname" && value.length > 8) return false;
      if (name === "description" && value.length > 30) return false;
      return value;
    },
    cb: () => setActiveButton(true),
    dependencies: [curMember],
  });

  const fileUploader = useRef(null);
  const [profileImage, setProfileImage] = useState(curMember?.member_image);

  const handleOpenFileUploader = (e) => {
    if (e) e.preventDefault();
    if (inputs.imageId && !open) {
      setOpen(true);
    } else {
      setOpen(false);
      if (fileUploader.current) fileUploader.current.click();
    }
  };

  const handleResetProfile = async (e) => {
    if (e) e.preventDefault();
    setOpen(false);
    setProfileImage("/imgs/profile_big.png");
    setInputs({ ...inputs, imageId: null });
    setActiveButton(true);
  };

  const handleUpdateProfile = async (e) => {
    if (!authStore.isAuth) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("member_id", curMember.id);
    const res = await req(
      "/api/file",
      {
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      },
      authStore.authToken
    ).catch((err) => console.warn(err));

    if (res && res.data.resultCode === 200) {
      setInputs({ ...inputs, imageId: res.data.data.id });
      setOpen(false);
      if (e.target.files[0])
        setProfileImage(URL.createObjectURL(e.target.files[0]));
      setActiveButton(true);
    } else {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleEditProfile = async () => {
    if (!curMember || !authStore.isAuth) return;
    // if (!inputs.imageId && curMember.image_id) {
    //   const res = await req(
    //     "/api/file/delete",
    //     {
    //       method: "post",
    //       data: {
    //         file: {
    //           id: curMember.image_id,
    //         },
    //       },
    //     },
    //     authStore.authToken
    //   );
    //   if (res && res.data.resultCode < 0) alert("파일 삭제에 실패하였습니다.");
    //   else alert("파일 삭제 성공");
    // }

    const res = await req(
      "/api/v1/member/profile",
      {
        method: "post",
        data: {
          member_id: curMember.id,
          nickname: inputs.nickname,
          description: inputs.description,
          image_id: inputs.imageId,
          bg_id: curMember.background_image_id,
          remove_image: !inputs.imageId,
        },
      },
      authStore.authToken
    ).catch((err) => console.warn(err));
    console.log(res);
    if (res && res.data.resultCode > 0) {
      authStore.initMemberList();
      globalStore.setProfileEditModalHidden(true);
    }
  };
  const [activeButton, setActiveButton] = useState(false);

  useEffect(() => {
    if (curMember) setProfileImage(curMember.member_image);
  }, [curMember, authStore.initMemberList]);

  useEffect(() => {
    if (hidden) setActiveButton(false);
  }, [hidden]);

  return (
    <>
      <div className="Wrap" hidden={hidden}>
        <div className="mask">
          <div className="popup_box rep_popup">
            <div className="popup_hd">
              <p className="popup_title">프로필 수정</p>
              <div
                className="popup_close"
                onClick={() => globalStore.setProfileEditModalHidden(true)}
              >
                <img src="/imgs/x_btn4.png" />
              </div>
            </div>
            <div
              className={`profile_edit_box${
                curMember?.grade > 3 ? " name_edit" : ""
              }`}
            >
              <div className="profile_img">
                <img src={profileImage ?? "/imgs/profile_big.png"} />
                <div className="shot_box">
                  <img
                    src="/imgs/camera.png"
                    onClick={handleOpenFileUploader}
                    style={{ cursor: "pointer" }}
                  />
                  <ul className="profile_list" hidden={!open} ref={ref}>
                    <li>
                      <a onClick={(e) => handleResetProfile(e)}>
                        기본 프로필로 변경
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          if (fileUploader.current)
                            fileUploader.current.click();
                        }}
                      >
                        프로필 사진 설정
                      </a>
                    </li>
                  </ul>
                  <input
                    ref={fileUploader}
                    type="file"
                    id="profile_file_uploader"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleUpdateProfile(e)}
                    hidden
                  />
                </div>
              </div>
              {curMember?.grade <= 3 && (
                <p className="profile_name">
                  {curMember?.member_nickname ?? ""}
                  {curMember?.grade === 1 && (
                    <span className="certification">
                      <img src="/imgs/badge.png" />
                    </span>
                  )}
                </p>
              )}
            </div>
            {curMember?.grade > 3 && (
              <div className="state_box">
                <input
                  type="text"
                  name="nickname"
                  className="info_input"
                  placeholder="닉네임을 입력해주세요."
                  maxLength="8"
                  value={inputs?.nickname ?? ""}
                  onChange={handleChange}
                />
                <p className="count_number">
                  <span className="change_num">
                    {inputs?.nickname?.length ?? 0}
                  </span>
                  /8
                </p>
              </div>
            )}
            <div className="state_box">
              <input
                type="text"
                name="description"
                className="info_input"
                placeholder="상태 메세지를 입력해주세요."
                maxLength="30"
                value={inputs?.description ?? ""}
                onChange={handleChange}
              />
              <p className="count_number">
                <span className="change_num">
                  {inputs?.description?.length ?? 0}
                </span>
                /30
              </p>
            </div>

            <div className="popup_chk">
              <button
                type="button"
                className="info_btn popup_btn edit_btn"
                disabled={!activeButton}
                onClick={handleEditProfile}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .popup_close {
            cursor: pointer;
          }
          .certification > img {
            vertical-align: inherit;
          }
          .info_input {
            padding: 0px 56px 0px 16px;
          }
          /* ------------------------ 프로필 수정 ------------------------ */
          .profile_edit_box {
            width: 100%;
            height: auto;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }
          .profile_img {
            position: relative;
            width: 144px;
            height: 144px;
            border-radius: 50%;
          }
          .profile_img > img {
            width: inherit;
            height: inherit;
            border-radius: 50%;
          }
          .shot_box {
            position: absolute;
            bottom: 0;
            right: -3px;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: var(--white);
            box-shadow: 0 3px 6px 0 var(--black-oapcity-100);
          }
          .profile_list {
            position: absolute;
            top: 20px;
            left: 11px;
            width: 128px;
            height: auto;
            background-color: var(--white);
            box-shadow: 0 3px 6px 0 var(--black-oapcity-100);
            z-index: 1;
          }
          .profile_list li {
            width: 100%;
            height: auto;
          }
          .profile_list li a {
            cursor: pointer;
            display: block;
            padding: 13px 8px;
            line-height: 1.5;
            letter-spacing: -0.07px;
            text-align: center;
            font-size: 14px;
            color: var(--gray900);
          }
          .profile_name {
            padding: 24px 0 16px;
            line-height: 1.5;
            letter-spacing: -0.08px;
            font-size: 16px;
            color: var(--gray900);
          }
          .state_box {
            position: relative;
            width: 100%;
            height: auto;
            margin-bottom: 16px;
          }
          .count_number {
            position: absolute;
            top: 15px;
            right: 16px;
            line-height: 1.5;
            letter-spacing: -0.07px;
            font-size: 14px;
            color: var(--gray-500);
          }
          .edit_btn {
            width: 100%;
          }
          .name_edit {
            margin-bottom: 32px;
          }
          /* ------------------------ //프로필 수정 ------------------------ */
        `}
      </style>
    </>
  );
});

const Edit = (props) => <EditComponent {...props} />;
export default Edit;
