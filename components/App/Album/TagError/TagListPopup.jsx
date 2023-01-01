import EmptyBox from "@/assets/imgs/empty_box.svg";
import Image from "next/image";

/* scroll */
export default function TagListPopup({ tags }) {
  return (
    <>
      <div className="tag_header">
        <div className="closure_container">
          <p className="closure" />
        </div>
        <div className="modal_head">
          <span>태그된 원아</span>
        </div>
      </div>
      <ul className="tag_list">
        {tags &&
          tags.map((v, i) => (
            <li key={i} className="tag_li">
              <span className="profile">
                <Image
                  width="40px"
                  height="40px"
                  className=""
                  src={v.kid_thumb_url || EmptyBox}
                />
              </span>
              <span className="name_box">
                {v.class_name + " " + v.kid_name}
              </span>
            </li>
          ))}
      </ul>
    </>
  );
}
