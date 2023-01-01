import {useMemo, useState, useEffect, forwardRef} from "react";
import styles from "@/styles/modules/TextField.module.scss";
import {MergeStyles} from "@/lib/StyleUtils";

export default forwardRef(
  (
    {
      className,
      error,
      helperText,
      timer,
      handleTimer = () => {},
      onTimeset = () => {},
      ...inputProps
    },
    ref
  ) => {
    const [textFieldError, setTextFieldError] = useState(error);
    const {min, sec} = timer ?? {min: 0, sec: 0};

    const initialTextFieldClasses = className
      ? [styles.info_input, className]
      : [styles.info_input];
    const TextFieldClasses = useMemo(
      () =>
        MergeStyles(
          textFieldError
            ? [...initialTextFieldClasses, styles.warning]
            : initialTextFieldClasses
        ),
      [textFieldError]
    );

    useEffect(() => {
      setTextFieldError(error);
    }, [error]);

    useEffect(() => {
      let pid;
      if (timer)
        pid = setInterval(() => {
          const remains = min * 60 + sec - 1;
          if (remains >= 0) {
            handleTimer({min: Math.floor(remains / 60), sec: remains % 60});
          } else {
            setTextFieldError(true);
            onTimeset();
            if (pid) clearInterval(pid);
          }
        }, 1000);
      return () => clearInterval(pid);
    }, [min, sec]);

    return (
      <li className={styles.info_list}>
        <input className={TextFieldClasses} ref={ref} {...inputProps} />
        {timer && (
          <span className={styles.request_time}>
            {min >= 10 ? min : "0" + min}:{sec >= 10 ? sec : "0" + sec}
          </span>
        )}
        {helperText && error && <p className={"warning_text"}>{helperText}</p>}
        {helperText && !error && <p className={"request_ok"}>{helperText}</p>}
      </li>
    );
  }
);
