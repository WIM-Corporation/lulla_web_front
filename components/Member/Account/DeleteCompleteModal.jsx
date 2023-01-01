import useStores from "@/stores/useStores";
import { useRouter } from "next/router";

export default ({ hidden }) => {
  const router = useRouter();
  const { authStore } = useStores();
  return (
    <div className="Wrap" hidden={hidden}>
      <div className="mask">
        <div className="popup_box" style={{ paddingTop: 24 }}>
          <p className="popup_text">
            계정이 삭제되어 모든 기기에서 로그아웃됩니다. <br />
            재로그인해 주시기 바랍니다.
          </p>

          <div className="popup_chk">
            <button
              style={{ cursor: "pointer" }}
              type="button"
              className="close_btn popup_bigbtn"
              onClick={() => {
                authStore.signOut();
                router.push("/");
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
