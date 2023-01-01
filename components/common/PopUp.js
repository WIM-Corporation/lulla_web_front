import { useEffect, useRef } from "react";
import styles from "@/styles/modules/PopUp.module.scss";
import { MergeStyles } from "@/lib/StyleUtils";
import Image from "next/dist/client/image";
import xBtn from "@/assets/imgs/x_btn3.png";
import Link from "next/link";

export default function PopUp({
  title,
  children,
  showCloseButton,
  cancelBtn,
  okBtn,
  onCancelBtnClick,
  onOkBtnClick,
  open,
  handleClose,
}) {
  const ref = useRef(null);

  const handleOutsideClick = (e) => {
    if (ref.current && !ref.current.contains(e.target) && handleClose)
      handleClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  return (
    <div className={styles.mask} style={{ display: open ? "flex" : "none" }}>
      <div
        ref={ref}
        className={MergeStyles(
          showCloseButton
            ? [styles.popup_box, styles.privacy_box]
            : [styles.popup_box]
        )}
      >
        <div className={styles.privacy_hd}>
          {title && <p className={styles.privacy_title}>{title}</p>}
          {showCloseButton && (
            <div className={styles.popup_close} onClick={handleClose}>
              <Image src={xBtn} />
            </div>
          )}
        </div>

        {/* Mount Scroll Event를 적용하기 위해 open state 조건부 렌더링 */}
        {open && children}

        <div className={styles.popup_chk}>
          {okBtn && (
            <Link href="" passHref>
              <a
                className={MergeStyles([styles.ok_btn, styles.popup_btn])}
                onClick={onOkBtnClick}
              >
                {okBtn}
              </a>
            </Link>
          )}
          {cancelBtn && (
            <Link href="" passHref>
              <a
                className={MergeStyles([styles.cancel_btn, styles.popup_btn])}
                onClick={onCancelBtnClick || handleClose}
              >
                {cancelBtn}
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export const PopUpBasicBody = ({ children }) => {
  return <p className={styles.popup_text}>{children}</p>;
};

export const PopUpPolicyBody = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.scroll({ top: 0 });
  }, []);
  return (
    <div ref={ref} className={styles.privacy_body}>
      {children}
    </div>
  );
};

export const PopUpPolicyBodyItem = ({ title, desc }) => {
  return (
    <div className={styles.privacy_cont}>
      <p className={styles.privacy_subtitle}>{title}</p>
      <p className={styles.privacy_text}>{desc}</p>
    </div>
  );
};
