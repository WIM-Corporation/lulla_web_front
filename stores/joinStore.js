import {
  makeObservable,
  observable,
  action
} from "mobx";

/** 회원 로그인 상태 및 사용자 관련 상태 스토어 **/
class JoinStore {
  joinName = ""; // 이름
  joinPhone = ""; // 전화번호

  constructor() {
    makeObservable(this, {
      joinName: observable,
      joinPhone: observable,
      saveInfo: action,
      initInfo: action,
    });
  }

  saveInfo(name, phone) {
    this.joinName = name;
    this.joinPhone = phone;
  }
  
  initInfo(){
    this.joinName = "";
    this.joinPhone = "";
  }
}

const joinStore = new JoinStore();
export default joinStore;
