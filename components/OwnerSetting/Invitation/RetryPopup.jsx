import { req } from "@/lib/apiUtil";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";

const RetryPopupComponent = observer(
  ({ isOpen, onClose, inviteId, demandId, cb }) => {
    const { authStore, globalStore } = useStores();
    const RETRY_TYPE =
      inviteId && !demandId
        ? "invite"
        : !inviteId && demandId
        ? "approve"
        : "unknown";

    const handleRetry = async () => {
      if (!authStore?.curMember?.id || RETRY_TYPE === "unknown") return;

      const res = await req(
        `/api/v1${
          RETRY_TYPE === "invite" ? "/invite/reinvite" : "/demand/accept"
        }`,
        {
          method: "post",
          data:
            RETRY_TYPE === "invite"
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
      console.log(res);
      if (res && res.data.resultCode > 0) {
        globalStore.setToastActive(
          RETRY_TYPE === "invite"
            ? "초대장이 발송되었습니다."
            : "가입 승인이 완료되었습니다."
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
                <img src="/imgs/ic-invita-fill-circle-xl-bold.svg" />
              </div>
              <p className="popup_text">
                {RETRY_TYPE === "invite"
                  ? "재초대하시겠습니까?"
                  : "가입을 승인하시겠습니까?"}
              </p>

              <div className="popup_chk">
                <a className="close_btn popup_btn" onClick={onClose}>
                  취소
                </a>
                <a className="ok_btn popup_btn" onClick={handleRetry}>
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

const RetryPopup = (props) => <RetryPopupComponent {...props} />;
export default RetryPopup;
