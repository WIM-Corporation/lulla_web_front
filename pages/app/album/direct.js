import useState from "react-usestateref";
import qs from "qs";
import { initAuth } from "@/components/App/Album/nativeCalls";
import { useEffect, useRef } from "react";
import AIAlbum from "@/components/App/Album/AIAlbum";
import useStores from "@/stores/useStores";
import DirectAlbum from "@/components/App/Album/DirectAlbum";

export default function AlbumContainer() {
  const deviceType =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.type || "web";
  const [ready, setReady, readyRef] = useState(false);
  const { authStore } = useStores();

  useEffect(() => {
    console.log("init direct page");
    initAuth(deviceType, authStore);

    let _initWait = setInterval(() => {
      if (authStore.token) {
        clearInterval(_initWait);
        setReady(true);
      }
    }, 500);
    setTimeout(() => clearInterval(_initWait), 5000);
  }, []);

  const onBack = () => {
    if (deviceType == "android") {
      window.app.cancel();
    } else if (deviceType == "ios") {
      window.webkit.messageHandlers.cancel.postMessage("");
    } else {
      alert("이 기능은 앱에서만 동작합니다.");
    }
  };

  const onComplete = (result) => {
    console.log("[handleComplete] 완료 : ", result);
    if (deviceType == "android") {
      window.app.complete(result);
    } else if (deviceType == "ios") {
      window.webkit.messageHandlers.complete.postMessage(result);
    } else {
      alert("이 기능은 앱에서만 동작합니다." + result);
    }
  };

  return (
    <div className="Wrap">
      {ready ? (
        <main>
          <DirectAlbum
            memberId={authStore.memberId}
            onComplete={onComplete}
            onBack={onBack}
            deviceType={deviceType}
          />
        </main>
      ) : null}
    </div>
  );
}
