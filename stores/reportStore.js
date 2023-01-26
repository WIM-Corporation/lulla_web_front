import { makeObservable, observable, computed, action } from "mobx";

/** 회원 로그인 상태 및 사용자 관련 상태 스토어 **/
class ReportStore {
    isEdited = false;

    constructor() {
        makeObservable(this, {
            isEdited: observable,
            setEditFlag: action
        });
    }
    setEditFlag(state) {
        this.isEdited = state;
    }
}
const reportStore = new ReportStore();
export default reportStore;
