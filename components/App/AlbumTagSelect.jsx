import styles from "@/styles/modules/AlbumTagSelect.module.scss";
import DefaultImg from "@/assets/imgs/default.png";
import CheckCircle from "@/assets/imgs/check_circle.svg";
import Image from "next/image";
import { useEffect } from "react";

export default function AlbumTagSelect({
  kidList,
  currentIdx,
  imageListData,
  onClickKid,
  editMode,
}) {
  /* 원아 */
  const imageLoadFail = (e) => (e.target.src = "/imgs/app/album/default.png");

  /* 길어서 축약 */
  const findKid = (ki) => {
    const selected =
      imageListData[currentIdx].tags.findIndex(
        (ti) => ti.kid_id && ti.kid_id == ki
      ) > -1;
    return selected;
  };

  useEffect(() => {
    console.log(kidList);
  }, []);

  return (
    <div style={{ minHeight: "100px" }}>
      {!editMode ? (
        <div
          className="tag_count"
          style={{ padding: "12px 16px", fontSize: "12px" }}
        >
          <span className="tag_num">
            {imageListData && imageListData.length > 0
              ? imageListData[currentIdx].tags.length
              : 0}{" "}
            명이 선택되었습니다.
          </span>
          <span className={styles.select_all}>전체선택</span>
        </div>
      ) : null}

      <div className={styles.tag_item_list}>
        <ul className={styles.tag_grid}>
          {kidList.map((item, idx) => {
            const selected = findKid(item.kid_id);
            return (
              <li key={item.kid_id} className={styles.kid_item}>
                <figure
                  style={{ position: "relative" }}
                  onClick={onClickKid}
                  data-selected={selected}
                  data-tag-idx={idx}
                >
                  <img
                    width="50"
                    height="50"
                    src={item.kid_thumb_url ? item.kid_thumb_url : DefaultImg}
                    onClick={onClickKid}
                    data-tag-idx={idx}
                    onError={imageLoadFail}
                  />
                  <span className={styles.ck_selected}>
                    <Image width="20" height="20" src={CheckCircle} />
                  </span>
                  <figcaption onClick={onClickKid} data-tag-idx={idx}>
                    {item.kid_name ? item.kid_name : "-"}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
