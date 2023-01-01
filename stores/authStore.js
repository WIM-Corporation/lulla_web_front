import axios from "axios";
import { makeObservable, observable, computed, action } from "mobx";

/** 회원 로그인 상태 및 사용자 관련 상태 스토어 **/
class AuthStore {
  loading = true;
  authToken = "not login"; // 회원 인증 login token
  // isAuth = false; // computed
  userInfo = null; // 사용자 정보
  isMemberLoaded = false;
  memberList = []; // 멤버 프로필 목록
  curMember = null; // 현재 선택된 멤버 프로필
  invitations = []; // 나에게 온 초대장

  constructor() {
    makeObservable(this, {
      loading: observable,
      authToken: observable,
      userInfo: observable,
      isMemberLoaded: observable,
      memberList: observable,
      curMember: observable,
      invitations: observable,
      isAuth: computed,
      signOut: action,
      signIn: action,
      setUserInfo: action,
      autoLoginProcess: action,
      setMemberList: action,
      setCurrentMember: action,
    });
  }

  get isAuth() {
    return this.authToken.length > 16;
  }

  signOut() {
    window.localStorage.setItem("authToken", "");
    this.authToken = "";
    this.isMemberLoaded = false;
  }

  signIn(authToken) {
    this.authToken = authToken;
    window.localStorage.setItem("authToken", authToken);
  }

  setUserInfo(info) {
    this.userInfo = info;
  }

  autoLoginProcess(completeCallback, errorCallback) {
    if (this.isAuth) {
      this.loading = false;
      console.log(this.loading);
      return;
    } // 이미 로그인 되어 있으면 pass
    const savedAuthToken = window.localStorage.getItem("authToken");
    // console.log(savedAuthToken);
    if (savedAuthToken) {
      console.log("auto login"); // TODO 유효한 로그인인지 API 확인도 필요함
      this.authToken = savedAuthToken;
      this.initMemberList();
      this.loading = false;
      if (completeCallback && typeof completeCallback == "function")
        completeCallback();
      return;
    }
    if (errorCallback && typeof errorCallback == "function") errorCallback();
  }

  setMemberList(list) {
    this.memberList = list;
    this.isMemberLoaded = true;
    const defaultMember = window.localStorage.getItem("defaultMember");
    if (defaultMember) this.setCurrentMember(defaultMember);
  }

  setCurrentMember(id) {
    const idx = this.memberList.findIndex((item) => item.id == id);
    this.curMember = this.memberList[idx];
    console.log(this.memberList[idx]);
    window.localStorage.setItem("defaultMember", id);
  }

  /* -- */
  // 멤버 목록 가져오기 통신
  async initMemberList() {
    // API 통신
    await axios({
      method: "get",
      url: "/api/v1/auth/get-info?with_school=ok",
      headers: { Authorization: "Bearer " + this.authToken },
    })
      .then(({ data: respData }) => {
        console.log(respData);
        if (respData.resultCode == 1) {
          this.setUserInfo(respData.data.user_info);
          this.setMemberList(respData.data.member_list);
          // console.log(window.location.href);
          // if( !window.location.href.includes("/member/append/select") ){
          //   if( respData.data.member_list.length == 0 ) {
          //     alert("프로필 생성이 필요합니다?!");
          //     window.location.href = "/member/append/select";
          //   }
          // }
        } else {
          // console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        console.error("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  }

  async getInvitation() {
    if (!this.isAuth || !this.authToken) return;
    const invitations = await axios({
      method: "post",
      url: "/api/v1/invite/list",
      headers: { Authorization: "Bearer " + this.authToken },
    }).catch((err) => console.error(err));

    if (invitations?.data?.resultCode > 0)
      this.invitations = invitations.data.data.invite_list;
  }
}

const authStore = new AuthStore();
export default authStore;
