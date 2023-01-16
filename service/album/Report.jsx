export function Report(reportId) {
  this.id = reportId;
}

Report.prototype = {
  initReport: null,
  output: null,
  reporter: null,

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
      content: value.content,
      media: value.media,
      created_at: value.created_at,
      is_confirmed: value.is_confirmed || false,
      tag_type: value.tag_type,
    };
  },

  get initText() {
    return this.initReport?.content;
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

  set setReporter(value) {
    // parse rsMember info
    this.reporter = {
      profile: value.member_image,
      name: value.member_nickname,
      created_at: this.output?.created_at,
    };
  },
};
