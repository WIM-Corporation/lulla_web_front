import useStores from "@/stores/useStores";

export const initPage = (deviceType) => {
  // call native functions for init
  if (deviceType == "ios") {
    window.webkit.messageHandlers.pageLoaded.postMessage("");
  } else if (deviceType == "android") {
    window.app.pageLoaded();
  } else {
    alert("[페이지 초기화] 이 기능은 앱에서 정상 작동 합니다.");
  }
};

export const initAuth = (deviceType, authStore) => {
  authStore.clear();

  // bind auth receive function
  window.receiveAuthData = function (token, memberId) {
    authStore.setAuth(token, memberId);
  };

  // call native functions for init
  if (deviceType == "ios") {
    window.webkit.messageHandlers.getAuthData.postMessage("");
  } else if (deviceType == "android") {
    window.app.getAuthData();
  } else {
    alert("[페이지 초기화] 이 기능은 앱에서 정상 작동 합니다.");
    authRef.current = {
      token: "web",
      memberId: "web",
    };
  }
};

export const back = (deviceType) => {
  if (deviceType == "android") {
    window.app.cancel();
  } else if (deviceType == "ios") {
    window.webkit.messageHandlers.cancel.postMessage("");
  } else {
    alert("[뒤로가기] 이 기능은 앱에서만 동작합니다.");
  }
};
