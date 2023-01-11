import axios from "axios";
import { makeObservable, observable, action } from "mobx";

// Webview auth 관리
class Auth {
  token = null;
  memberId = null;
  interceptor = null;

  constructor() {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.headers.post["accept"] = "*/*";
    axios.interceptors.response.use(
      (response) => {
        // router back case
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

    makeObservable(this, {
      token: observable,
      memberId: observable,
      clear: action,
      setAuth: action,
      getToken: action,
    });
  }

  clear() {
    if (window && window.localStorage) {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("member_id");
    }
    this.token = null;
    this.memberId = null;
  }

  setAuth(token, memberId) {
    this.token = token;
    this.memberId = memberId;
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  getToken() {
    return this.token;
  }
}

const authStore = new Auth();
export default authStore;
