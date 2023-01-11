export function ImageTag() {}

const parseToReturnData = (data) => {
  return data.map((imgObj) =>
    imgObj?.mime_type?.startsWith("video")
      ? {
          mime_type: imgObj.mime_type || null,
          seq: imgObj.seq, // setImage 호출했을때 seq번호
          video_path: imgObj.video_path || null,
          width: imgObj.width || -1,
          height: imgObj.height || -1,
          duration: imgObj.duration || [], // 빈배열로 시작
          isTagged: imgObj.isTagged || true,
        }
      : {
          mime_type: imgObj.mime_type || null,
          seq: imgObj.seq, // setImage 호출했을때 seq번호
          data: imgObj.data || null,
          width: imgObj.width || -1,
          height: imgObj.height || -1,
          tags: imgObj.tags || [], // 빈배열로 시작
          isTagged: imgObj.isTagged || false,
        }
  );
};

// return data
ImageTag.prototype = {
  school_id: null,
  class_id: null,
  total_medias: null,
  medias: [],
  deleted_medias_seq: [],

  set init(value) {
    if (typeof value.school_id === undefined) {
      throw new Error("유치원 정보가 필요합니다.");
    }
    if (typeof value.medias === undefined || typeof value.medias != "object") {
      throw new Error("이미지 정보가 필요합니다.");
    }

    if (value.medias.length < 1) {
      throw new Error("이미지가 없습니다.");
    }

    for (const imgObj of value.medias) {
      if (typeof imgObj.seq === undefined) {
        throw new Error("이미지 시퀀스 정보가 없습니다");
      }
    }

    this.school_id = value.school_id;
    this.class_id = value.class_id;
    this.total_medias = value.total_medias;
    this.medias = parseToReturnData(value.medias);
    return;
  },
};
