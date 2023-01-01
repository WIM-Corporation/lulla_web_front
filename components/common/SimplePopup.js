import styles from "@/styles/modules/SimplePopup.module.scss";

/* TODO: refactoring set interface for title + cb*/
export default function SimplePopup(show, onClose, onConfirm) {
  return (
    <>
      <div className="Wrap" hidden={!show}>
        <div className={styles.popup_mask}>
          <div className={styles.simple_popup}>
            <div className={styles.chk}>
              <a className={styles.popup_btn} onClick={onConfirm}>
                삭제
              </a>
              <a className={styles.popup_btn} onClick={onClose}>
                취소
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
