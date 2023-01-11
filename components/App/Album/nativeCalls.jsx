import axios from "axios";

function setAxios(token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.post["accept"] = "*/*";
  axios.interceptors.response.use(
    (response) => {
      // custom errorcode check
      if (response.data.resultCode != 1) {
        let customError = new Error(response.data.message);
        response.status = response.data.resultCode;
        customError.response = response;
        return Promise.reject(customError);
      }
      return response.data.data;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

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

export const initAuth = (deviceType, authRef) => {
  // bind auth receive function
  window.receiveAuthData = function (token, memberId) {
    authRef.current = {
      token,
      memberId,
    };
    setAxios(token);
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
    setAxios("web");
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
