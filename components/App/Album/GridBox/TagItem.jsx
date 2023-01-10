import circleX from "@/assets/imgs/circle_x.svg";
import styles from "./TagItem.module.scss";

export const TagItem = ({ tag, i, imgSrc, onClickHandler }) => {
  return (
    <li key={i} className={styles.image_li}>
      <div
        className={styles.cut_img}
        onClick={() => onClickHandler(tag, i, "img")}
      >
        <Canvas
          key={i}
          img={new window.Image()}
          imgSrc={imgSrc}
          width={100}
          height={100}
        />
        <span
          className={styles.tag_del}
          onClick={() => onClickHandler(tag, i, "del")}
        >
          <Image src={circleX} />
        </span>
      </div>
      <p className={styles.child_name}>{tag?.kid_name}</p>
      <p className={styles.child_class}>{tag?.class_name}</p>
    </li>
  );
};
