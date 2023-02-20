import { makeObservable, observable, computed, action } from "mobx";

/** 회원 로그인 상태 및 사용자 관련 상태 스토어 **/
class ReportStore {
    isEdited = false;
    errorEditedTags = null;

    constructor() {
        makeObservable(this, {
            isEdited: observable,
            errorEditedTags: observable,
            setEditFlag: action,
            setErrorEditedTags: action,
        });
    }
    setEditFlag(state) {
        this.isEdited = state;
    }
    setErrorEditedTags(tags) {
        this.errorEditedTags = tags;
    }
}
const reportStore = new ReportStore();
export default reportStore;
