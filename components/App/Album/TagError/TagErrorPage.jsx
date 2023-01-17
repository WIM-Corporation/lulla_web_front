import TagListPopup from "@/components/App/Album/TagError/TagListPopup";
import { ViewBox } from "@/components/App/Album/ViewBox/ViewBox";
import { WriteBox } from "@/components/App/Album/WriteBox/WriteBox";
import { errMsg } from "@/components/common/Utils";
import axios from "axios";
import router from "next/router";
import { useEffect, useRef, useState } from "react";

export const ReportContainer = ({ report, onWrite }) => {
  // tag list popup
  const [tagListPopup, showTagList] = useState(false);
  const [tagList, setTagList] = useState([]);
  const textRef = useRef(null);
  const [ready, setReady] = useState(false);
  const tagType = report.output.tag_type;

  async function getKidList(school_id, class_id, tag_list) {
    await axios
      .post("/api/v1/kid/list/class", { school_id, class_id })
      .then((res) => {
        const class_name = res.class_name;
        if (!class_name) {
          throw new Error("Class 정보가 없습니다.");
        }

        const kid_list = res.kid_list;
        if (!kid_list) {
          throw new Error(class_name + "반의 원아 정보가 없습니다");
        }

        // kid_list to map
        const kid_map = kid_list.reduce((m, kid) => {
          m[kid.kid_id] = kid;
          return m;
        }, {});

        // tag update
        const updatedTags = tag_list.map((tag) => {
          tag.kid_thumb_url = kid_map[tag.kid_id]?.kid_thumb_url;
          tag.class_name = class_name;
          return tag;
        });
        console.log("[getKidList] updatedTags", updatedTags);
        setTagList(updatedTags);
      })
      .catch((err) => {
        console.error("[getKidList] Failed : ", err);
        alert(errMsg("원아 목록을 불러올 수 없습니다. ", err));
      });
  }

  useEffect(() => {
    console.log("init tagerrorpage", report);
    setTagList(report.media.tags);
    getKidList(report.schoolId, report.classId, report.media.tags);
    setReady(true);
  }, []);

  const clickEditBtn = () => {
    const pathname = report.output.tag_type === 0 ? `/app/album/report/edit` : `/app/album/report/edit`;
    router.push(
      {
        pathname,
        query: {
          initData: JSON.stringify(report.output),
          reportId: report.id,
        },
        pathname
      },
    );
  }

  const clickTagInfoIcon = () => {
    showTagList(true)
  }

  return (
    <>
      {ready ? (
        <>
          <ViewBox
            mediaArray={[report.media]}
            total={report.totalMedias}
            idx={0}
            onClickTagInfo={clickTagInfoIcon}
            showTag={tagListPopup}
            isAiTag={tagType === 0 ? true : false}
            currentIdx={0}
            openModal={(type) => {
              //TODO: modal manager
              if (type == "tag-info") showTagList(true);
            }}
            tagBox
          />
          <WriteBox
            ref={textRef}
            initText={report.initText}
            reporter={report.reporter}
            onInput={onWrite}
            onClick={clickEditBtn}
          ></WriteBox>
          <div
            className={`overlay ${tagListPopup ? "show" : ""}`}
            onClick={() => showTagList(false)}
          />
          <div className={`tag_list ${tagListPopup ? "show" : ""}`}>
            <TagListPopup tags={tagList} />
          </div>
        </>
      ) : null}
    </>
  );
};
