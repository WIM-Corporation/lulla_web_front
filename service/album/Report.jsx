export function Report() {}

Report.prototype = {
  initReport: null,
  output: null,

  set init(value) {
    /* Check data invalid */
    if (typeof value.school_id === undefined) {
      alert("유치원 정보가 필요합니다.");
      return;
    }
    if (typeof value.media === undefined || typeof value.media != "object") {
      alert("이미지 정보가 필요합니다.");
      return;
    }
    if (
      typeof value.total_medias === undefined ||
      typeof value.media.seq === undefined
    ) {
      alert("몇번째 사진인지 정보가 필요합니다.");
      return;
    }

    this.initReport = value;
    this.output = {
      album_id: value.album_id,
      member_id: value.member_id,
      class_id: value.class_id,
      school_id: value.school_id,
      total_medias: value.total_medias,
      is_confirmed: false,
      content: null,
      media: value.media,
    };
  },

  set content(value) {
    this.output.content = value;
  },

  get schoolId() {
    return this.output?.school_id;
  },

  get classId() {
    return this.output?.class_id;
  },

  get memberId() {
    return this.output?.member_id;
  },

  set memberId(value) {
    this.output.member_id = value;
  },

  get totalMedias() {
    return this.output?.total_medias;
  },

  get media() {
    return this.output?.media;
  },
};
