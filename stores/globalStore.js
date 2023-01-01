import { makeObservable, observable, action } from "mobx";

/** 사이트 전체에 사용되는 전역 스토어 */
class GlobalStore {
  isTest = false;
  toastMsg = "";
  toastActive = false;
  profileEditModalHidden = true;
  profileChangeModalHidden = true;

  constructor() {
    makeObservable(this, {
      isTest: observable,
      toastMsg: observable,
      toastActive: observable,
      profileEditModalHidden: observable,
      profileChangeModalHidden: observable,
      toggleIsTestValue: action,
      setToastActive: action,
      setProfileEditModalHidden: action,
      setProfileChangeModalHidden: action,
    });
    this.isTest = true;
  }

  toggleIsTestValue() {
    this.isTest = !this.isTest;
  }

  setToastActive(msg) {
    this.toastMsg = msg;
    this.toastActive = true;
    setTimeout(() => {
      this.toastActive = false;
      this.toastMsg = "";
    }, 3000);
  }

  setProfileEditModalHidden(state) {
    this.profileEditModalHidden = state;
  }

  setProfileChangeModalHidden(state) {
    this.profileChangeModalHidden = state;
  }
}

const globalStore = new GlobalStore();
export default globalStore;
