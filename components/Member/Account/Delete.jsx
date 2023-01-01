import { req } from "@/lib/apiUtil";
import useInput from "@/lib/hooks/useInput";
import classnames from "classnames";

export default function Delete({ hidden, handleHidden }) {
  const { inputs, handleChange, error, setError } = useInput({
    password: "",
    agree: false,
  });

  const handleDeleteAccount = async () => {};
  return (
    <>
      <div className="Wrap" hidden={hidden}>
        <div className="mask">
          <div className="popup_box rep_popup">
            <div className="popup_hd">
              <p className="popup_title">계정 삭제</p>
              <div
                className="popup_close"
                style={{ cursor: "pointer" }}
                onClick={() => handleHidden(true)}
              >
                <img src="/imgs/x_btn4.png" />
              </div>
            </div>
            <p className="popup_text delet_info">
              <span>1.</span> 계정 삭제 시 해당 계정 사용 및 복구가
              불가능합니다.
            </p>
            <p className="popup_text delet_info">
              <span>2.</span> 계정 삭제 즉시 삭제 처리되어 계정정보 및 서비스
              이용 기록이 삭제됩니다.
            </p>
            <p className="popup_text delet_info">
              <span>3.</span> 해당 계정에서 작성한 공지사항, 앨범, 알림장,
              투약의뢰서, 채팅, 책갈피, 댓글, 좋아요 등을 수정/삭제 할 수
              없습니다.
            </p>

            <div className="delet_chkbox">
              <div className="delet_chk">
                <input
                  type="checkbox"
                  name="agree"
                  id="term_view1"
                  className="term_chk"
                  value={inputs.agree}
                  onChange={handleChange}
                />
                <label htmlFor="term_view1">
                  안내 사항을 모두 확인하였으며, 이에 동의합니다.
                </label>
              </div>
            </div>

            <div className="delet_pwd">
              <input
                type="password"
                name="password"
                className={classnames({
                  info_input: true,
                  request_input: true,
                  warning: error.password,
                })}
                value={inputs.password}
                onChange={handleChange}
                placeholder="비밀번호"
              />
              {error.password && (
                <p className="warning_text delet_warning">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <div className="popup_chk">
              <button
                className={classnames({
                  ok_btn: true,
                  popup_btn: true,
                  red_bg: true,
                  delet_ok: true,
                  disabled: !inputs.agree || !inputs.password,
                })}
                disabled={!inputs.agree || !inputs.password}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
