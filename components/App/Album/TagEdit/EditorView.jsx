import { useEffect, useState, useRef, useCallback } from "react";
import { encodeImage } from "@/components/common/Utils";
import AlbumHeader from "@/components/App/Album/Common/AlbumHeader";
import FullCanvas from "@/components/App/Album/TagCanvas/FullCanvas";

/* Test Data */
import Loading from "@/components/App/Album/Common/Loading";
import AlbumTagSelect from "@/components/App/AlbumTagSelect";
import DraggableTag from "@/components/App/Album/TagCanvas/DraggableTag";

export default function EditorView({
  initKid,
  initClassName,
  kidList,
  editImage,
  editTag,
  editOnCancel,
  editOnComplete,
}) {
  const imgAreaBox = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [img, setImg] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  /* This tag values will edited and return to AI view */
  const [tags, setTags] = useState([]);
  const [curImage, setCurImage] = useState(null);
  const [width, setWidth] = useState(0);

  const [manualTag, setManualTag] = useState(null);
  const bboxRef = useRef(null);
  const [showBBox, setShowBBox] = useState(false);

  const reverseTagPosition = ([NL, NT, NR, NB]) => {
    // console.log("[reversePosition] FROM : ", [NL, NT, NR, NB]);
    const SW =
      imgAreaBox && imgAreaBox.current && imgAreaBox.current.offsetWidth;
    const SH = 400;
    const OW = img.naturalWidth;
    const OH = img.naturalHeight;
    const NAW = NR - NL;
    const NAH = NB - NT;

    let OL = null; // original left
    let OT = null; //original top
    let OAW = null; // original area width
    let OAH = null; // original height width

    let ratio = 1;
    if (OH < OW) {
      //offset 조정
      NT = NT - (SH - (OH * SW) / OW) / 2;
      ratio = OW / SW;
    } else {
      //offset 조정
      NL = NL - (SW - (OW * SH) / OH) / 2;
      ratio = OH / SH;
    }
    OL = NL * ratio;
    OT = NT * ratio;
    OAW = NAW * ratio;
    OAH = NAH * ratio;
    // console.log("[reversePosition] TO : ", [OL, OT, OL + OAW, OT + OAH]);
    return [OL, OT, OL + OAW, OT + OAH];
  };

  /* Parsing dataStr input from native => set & render image, tags */
  const setImage = (data) => {
    setTags(null);

    /* Check data invalid */
    if (typeof data === undefined || typeof data != "object") {
      alert("이미지 정보가 필요합니다.");
      return;
    }

    /* Draw a image */
    setCurImage(data);
    console.log("!!", data);
    const encoded = data.data ? encodeImage(data.data) : data.image_url;
    if (encoded) {
      setImgSrc(encoded);
      setTags(data.tags);
    } else {
      setError("이미지 인식에 실패하였습니다.");
    }
  };

  /* initialize */
  useEffect(() => {
    setTags(null);
    setError(false);
    setImg(new window.Image());
    setCurImage(null);
    setManualTag(initKid);
    if (!window) {
      console.log("[useEffect:[]] window is null.. please check environments.");
    }
    window.setImage = setImage;

    const resize = () => {
      setWidth(window.outerWidth);
    };
    window.addEventListener("resize", resize);
    resize();

    if (editImage) {
      setImage(editImage);
    }

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (img) {
      const _bbox =
        initKid.by_user && !initKid.kid_id
          ? {
              left: initKid.bbox[0],
              top: initKid.bbox[1],
              right: initKid.bbox[2],
              bottom: initKid.bbox[3],
            }
          : tagPosition(initKid.bbox);
      bboxRef.current = _bbox;
      setShowBBox(true);
    }
  }, [img]);

  useEffect(() => {
    if (img && !bboxRef.current) {
      const _bbox =
        initKid.by_user && !initKid.kid_id
          ? {
              left: initKid.bbox[0],
              top: initKid.bbox[1],
              right: initKid.bbox[2],
              bottom: initKid.bbox[3],
            }
          : tagPosition(initKid.bbox);

      bboxRef.current = _bbox;
      setShowBBox(true);
    }
  }, [manualTag]);

  /* 수동 태그 박스 */
  const handleResize = (rectPosition, type) => {
    if (!initKid.by_user) {
      return;
    }
    const left = Math.round(rectPosition[0]);
    const top = Math.round(rectPosition[1]);
    const right = Math.round(rectPosition[2]);
    const bottom = Math.round(rectPosition[3]);
    let resized = { ...manualTag };
    resized.bbox = [left, top, right, bottom];

    const new_bbox = {
      left: left,
      top: top,
      right: right,
      bottom: bottom,
    };
    // setBBox(new_bbox);
    bboxRef.current = new_bbox;
    setManualTag(resized);
  };

  const handleDrag = (deltaX, deltaY, newBbox) => {
    if (!initKid.by_user) {
      return;
    }

    const width = bboxRef.current.right - bboxRef.current.left;
    const height = bboxRef.current.bottom - bboxRef.current.top;
    const left = bboxRef.current.left + deltaX;
    const top = bboxRef.current.top + deltaY;
    const right = left + width;
    const bottom = top + height;

    let resized = { ...manualTag };
    resized.bbox = newBbox;

    const new_bbox = {
      left: left,
      top: top,
      right: right,
      bottom: bottom,
    };
    // setBBox(new_bbox);
    bboxRef.current = new_bbox;
    // console.log("[handleDrag] New bbox : ", new_bbox);
    // console.log("[handleDra] newBbox : ", newBbox);
    setManualTag(resized);
  };

  /* 원아 선택 onclick 이벤트 함수 */
  const handleSelectKid = useCallback((e) => {
    e.stopPropagation();

    const tagIdx = e.target.getAttribute("data-tag-idx"); // TODO 유효성 검사?
    const item = kidList[tagIdx];
    const newTagList = [...curImage.tags];

    /* check new kid tag */
    const idx = newTagList.findIndex(
      (tagItem) => tagItem.kid_id == item.kid_id
    );

    if (idx < 0) {
      e.target.parentNode.setAttribute("selected", true);
      let new_bbox = manualTag.bbox;

      // in case user tag, re-size based original img size.
      console.log("[handleSelectKid] current bbox : ", new_bbox);

      if (initKid.by_user && (!initKid.kid_id || initKid.bbox != new_bbox)) {
        new_bbox = reverseTagPosition(new_bbox);
      }
      newTagList.push({
        kid_id: item.kid_id,
        kid_name: item.kid_name,
        class_id: item.class_id,
        class_name: initClassName || "-",
        bbox: new_bbox,
        by_user: initKid.by_user,
        id: editTag?.id || "",
      });
    } else {
      /* if existed tag > error? modify? */
      alert("이미 선택한 원아는 재선택할 수 없습니다.");
    }

    e.target.parentElement.style.transition = "all ease 1s";
    e.target.parentElement.style.webkitTransition = "all ease 1s";

    e.target.parentElement.setAttribute("data-selected", true);
    setTimeout(() => {
      e.target.parentElement.setAttribute("data-selected", false);
      /* parse kid info from selected item */

      const editedImage = curImage;
      editedImage.tags = newTagList;
      setCurImage(editedImage);
      editOnComplete(curImage);
    }, 50);
    //
    /* in edit view, only handle a selected image from ai main view */
  });

  const tagPosition = ([left, top, right, bottom]) => {
    const fullScreenWidth = imgAreaBox?.current.offsetWidth;
    let startX = left;
    let startY = top;
    let areaW = right - left;
    let areaH = bottom - top;

    // 이미지 배율 관련 다시 계산
    let newWidth = img.naturalWidth;
    let newHeight = img.naturalHeight;

    const isLargeWidth = img.naturalHeight < img.naturalWidth;
    if (isLargeWidth) {
      // 가로가 더 크면
      if (img.naturalWidth > fullScreenWidth) {
        newHeight = (img.naturalHeight * fullScreenWidth) / img.naturalWidth;
        newWidth = fullScreenWidth;
      }
    } else {
      // 세로가 더 크면
      if (img.naturalHeight > 400) {
        newWidth = (img.naturalWidth * 400) / img.naturalHeight;
        newHeight = 400;
      }
    }
    let offsetX = (fullScreenWidth - newWidth) / 2;
    let offsetY = (400 - newHeight) / 2;
    startX = (newWidth * left) / img.naturalWidth;
    startY = (newHeight * top) / img.naturalHeight;
    if (offsetX == 0 || offsetY == 0) {
      // 배율 조정이 되었다고 간주
      // img.naturalWidth : areaW = newWidth : [NEW]
      areaW = (areaW * newWidth) / img.naturalWidth;
      // img.naturalHeight : areaH = newHeight : [NEW]
      areaH = (areaH * newHeight) / img.naturalHeight;
    }

    return {
      left: offsetX + startX,
      top: offsetY + startY,
      right: offsetX + startX + areaW,
      bottom: offsetY + startY + areaH,
    };
  };

  return (
    <>
      <AlbumHeader onBackBtn={editOnCancel} backBtnType={"x"} />

      <div ref={imgAreaBox} className="view_box">
        <FullCanvas loading={loading} img={img} imgSrc={imgSrc} resizing />
        {loading ? <Loading /> : null}
        <div className="manual_box">
          {showBBox ? (
            <DraggableTag
              left={bboxRef.current.left}
              top={bboxRef.current.top}
              right={bboxRef.current.right}
              bottom={bboxRef.current.bottom}
              zoomable={"n, w, s, e, nw, ne, se, sw"}
              onResize={(rectPosition, type) =>
                handleResize(rectPosition, type)
              }
              onDrag={(deltaX, deltaY, newBbox) =>
                handleDrag(deltaX, deltaY, newBbox)
              }
              draggable={initKid.by_user}
            ></DraggableTag>
          ) : null}
        </div>
      </div>
      {kidList?.length > 0 && curImage ? (
        <AlbumTagSelect
          kidList={kidList}
          onClickKid={handleSelectKid}
          imageListData={[curImage]}
          currentIdx={0}
          editMode
        />
      ) : (
        <div>
          {" "}
          <p>선택할 원아 목록이 없습니다. </p>
        </div>
      )}
    </>
  );
}
