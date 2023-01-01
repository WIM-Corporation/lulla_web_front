import Image from "next/image";
import warningIcon from "@/assets/imgs/error_warning.svg";
import styles from "@/styles/modules/WarnPopUp.module.scss";

/* TODO: refactoring set interface for title + cb*/
export default function WarnPopup(show, title, onClose, onConfirm) {
  return (
    <>
      <div className="Wrap" hidden={!show}>
        <div className="mask">
          <div className={styles.warn_popup}>
            <div className={styles.icon_box}>
              <Image src={warningIcon} />
            </div>
            <p className={styles.text_box}>{title}</p>

            <div className={styles.chk}>
              <a className="cancle_btn popup_btn" onClick={onClose}>
                취소
              </a>
              <a className="ok_btn popup_btn red_bg" onClick={onConfirm}>
                확인
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
