import VerifyForm from "@/components/Auth/VerifyForm";
import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";
import axios from "axios";

export default observer(({ onClose, changeCb }) => {
  const { authStore, globalStore } = useStores();
  const userInfo = authStore.userInfo;
  return (
    <>
      <div className="mask">
        <div className="adm_popupBox5">
          <div className="adm_header3">
            <p>휴대폰 번호 변경</p>
            <div className="popup_closeBox" onClick={onClose}>
              <img src="/imgs/icon-close-s.png" />
            </div>
          </div>

          <div className="inactive_infoBox">
            <p className="won_adm_Text">
              휴대폰 번호 변경을 위한 본인인증이 필요합니다.
            </p>
            <VerifyForm
              onSuccess={async ({ phone }) => {
                const res = await axios({
                  method: "post",
                  url: "/api/v1/user/phone",
                  data: {
                    user_id: authStore.userInfo.id,
                    phone,
                  },
                  headers: {
                    Authorization: "Bearer " + authStore.authToken,
                  },
                }).catch((err) => console.warn(err));
                if (!res || !res?.data?.resultCode < 0) return; // error
                console.log(res);
                authStore.setUserInfo({ ...userInfo, phone });
                onClose();
                globalStore.setToastActive("휴대폰 번호가 변경되었습니다.");
                if (changeCb) changeCb();
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .popup_closeBox {
          position: absolute;
          right: 24px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
});
