import { req } from "@/lib/apiUtil";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";

const CancelPopupComponent = observer(
  ({ isOpen, onClose, inviteId, demandId, cb }) => {
    const { authStore, globalStore } = useStores();
    const CANCEL_TYPE =
      inviteId && !demandId
        ? "invite"
        : !inviteId && demandId
        ? "approve"
        : "unknown";

    const handleCancel = async () => {
      if (CANCEL_TYPE === "unknown" || !authStore?.curMember) return;

      const res = await req(
        `/api/v1${
          CANCEL_TYPE === "invite" ? "/invite/cancel" : "/demand/denied"
        }`,
        {
          method: "post",
          data:
            CANCEL_TYPE === "invite"
              ? {
                  invite_id: inviteId,
                }
              : {
                  demand_id: demandId,
                  member_id: authStore.curMember.id,
                },
        },
        authStore.authToken
      ).catch((err) => console.warn(err));

      if (res && res.data.resultCode > 0) {
        globalStore.setToastActive(
          CANCEL_TYPE === "invite"
            ? "초대장이 취소되었습니다."
            : "승인 요청이 거절되었습니다."
        );
        if (cb && typeof cb === "function") cb();
      }
      onClose();
    };

    return (
      <>
        <div className="Wrap" hidden={!isOpen}>
          <div className="mask">
            <div className="popup_box rep_popup">
              <div className="popup_imgbox">
                <img src="/imgs/warnig-red.png" />
              </div>
              <p className="popup_text">
                {CANCEL_TYPE === "invite"
                  ? "초대를 취소하시겠습니까?"
                  : "승인 요청을 거절하시겠습니까?"}
              </p>

              <div className="popup_chk">
                <a className="cancle_btn popup_btn" onClick={onClose}>
                  취소
                </a>
                <a className="ok_btn popup_btn red_bg" onClick={handleCancel}>
                  확인
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

const CancelPopup = (props) => <CancelPopupComponent {...props} />;
export default CancelPopup;
