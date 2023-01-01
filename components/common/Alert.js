import {useEffect, useState} from "react";
import styles from "@/styles/modules/Alert.module.scss";

export default function Alert({message}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const tid = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(tid);
  }, []);

  return (
    <div hidden={!visible} className={styles.alert_box}>
      <div className={styles.alert_msg}>
        <p className={styles.end_text}>{message}</p>
      </div>
    </div>
  );
}
