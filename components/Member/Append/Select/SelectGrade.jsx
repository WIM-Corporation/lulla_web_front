import styles from "@/styles/modules/select.module.scss";
import { MergeStyles } from "@/lib/StyleUtils";
import Link from "next/link";

export default function SelectGrade() {
  // const router = useRouter();

  return (
    <>
      <main>
        <div className={MergeStyles(["title_box", styles.role_hd])}>
          <p className={"title_left"}>
            <span className={"point_teal"}>역할</span>을 선택해 <br />
            랄라를 시작해보세요.
          </p>
        </div>
        <section className={"sec_1"}>
          <ul className={"info_form"}>
            <li className={"info_list"}>
              <Link href="./owner">
                <a className={styles.role_btn}>원장님</a>
              </Link>
            </li>
            <li className={"info_list"}>
              <Link href="./teacher">
                <a className={styles.role_btn}>선생님</a>
              </Link>
            </li>
            <li className={"info_list"}>
              <Link href="./carer">
                <a className={styles.role_btn}>보호자님</a>
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
