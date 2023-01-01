import Image from "next/image";
import styles from "@/styles/modules/select.module.scss";
import { MergeStyles } from "@/lib/StyleUtils";

import ArrowLeft from "@/assets/imgs/carousel/arrow-left-xl.png";
import ArrowRight from "@/assets/imgs/carousel/arrow-right-xl.png";
import { useState, useRef } from "react";

export default function InvitationCarousel({ invitations }) {
  const [page, setPage] = useState(0);
  const ref = useRef(null);
  const handlePagePrev = () => {
    if (page >= 1 && ref.current) {
      ref.current.style.transform = `translate(-${(page - 1) * 100}%, 0)`;
      setPage((prev) => prev - 1);
    }
  };
  const handlePageNext = () => {
    if (page < invitations.length - 1 && ref.current) {
      ref.current.style.transform = `translate(-${(page + 1) * 100}%, 0)`;
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.role_slide_box}>
      <div
        className="carousel-inner"
        style={{
          display: "inline-flex",
          width: "100%",
          transition: "transform 1s",
        }}
        ref={ref}
      >
        {invitations?.map((v, i) => (
          <div
            className="carousel-item"
            style={{
              width: "100%",
              opacity: `${page === i ? 1 : 0}`,
              transition: "opacity 1s",
            }}
            key={v.id}
          >
            <InvitationLayout schoolName={v.school_name} type={v.type} />
          </div>
        ))}
      </div>

      <div className={styles.side_arrow}>
        <div
          className={MergeStyles([styles.arrow_btn, styles.prev_btn])}
          onClick={handlePagePrev}
        >
          <Image src={ArrowLeft} alt="left_btn" />
        </div>
        <div
          className={MergeStyles([styles.arrow_btn, styles.next_btn])}
          alt="right_btn"
          onClick={handlePageNext}
        >
          <Image src={ArrowRight} alt="right_btn" />
        </div>
      </div>

      <div className={styles.page_dot}>
        {invitations?.map((_, i) => (
          <div
            className={
              i === page
                ? MergeStyles([styles.dot_item, styles.active])
                : styles.dot_item
            }
          ></div>
        ))}
      </div>
    </div>
  );
}

export const InvitationLayout = ({ schoolName, type, disabled }) => {
  const typeNames = [
    "",
    "",
    "관리자님",
    "선생님",
    "선생님",
    "보호자님",
    "가족",
  ];
  return (
    <>
      <div className={MergeStyles(["title_box", styles.role_hd2])}>
        <p className={"title_left"}>
          <span className={"point_teal"}>{schoolName}</span>에서 <br />
          <span className={"accept_role"}>{typeNames[type]}</span>을 초대합니다.
        </p>
      </div>
      <section className={"sec_1"} style={{ minHeight: "max-content" }}>
        <p className={styles.accept_info}>
          미 수락 시 7일 후 삭제됩니다. 재초대 요청은 해당 원에 문의해주세요.
        </p>
        <ul className={"info_form"}>
          <li className={"info_list"}>
            <a href="javascript:void(0);" className={"accept_btn"}>
              수락하기
            </a>
          </li>
          <li className={"info_list"}>
            <a href="javascript:void(0);" className={"refuse_btn"}>
              거절하기
            </a>
          </li>
        </ul>
      </section>
    </>
  );
};
