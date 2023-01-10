import { useCallback } from "react";
import { GridLayout } from "./Grid";
import styles from "./TagBox.module.scss";
import { TagItem } from "./TagItem";

const DefaultBox = () => {
  return (
    <div className={styles.image_default}>
      <p>
        인식 된 얼굴이 없습니다. <br />
        영역을 선택하여 원아를 태그하세요.
      </p>
    </div>
  );
};

export const AITagBox = ({ tags, tagEventHandler }) => {
  const editTags = useCallback(
    (selected, i) => {
      const changed = selected.kid_id
        ? tags.filter((v) => v.kid_id !== selected.kid_id)
        : tags.filter((v, i) => i !== idx);
      tagEventHandler.change(changed);
    },
    [tags]
  );

  const onClickItemHandler = (selected, i, type) => {
    switch (type) {
      case "img":
        editTags(selected, i);
        break;
      case "del":
        tagEventHandler.focus(selected);
        break;
      default:
        console.log("Unhandled type event: " + type);
    }
  };

  return (
    <div className={styles.tag_box}>
      <p className={styles.tag_count}>
        <span className={styles.tag_num}> {tags?.length ?? 0} </span>명이
        태그되었습니다.
      </p>
      {!tags || tags.length == 0 ? (
        <DefaultBox />
      ) : (
        <GridLayout>
          {tags
            .filter((tag) => tag.kid_id != null)
            .map((tag, i) => (
              <TagItem
                tag={tag}
                i={i}
                imgSrc={imgSrc}
                onClickHandler={onClickItemHandler}
              />
            ))}
        </GridLayout>
      )}
    </div>
  );
};
