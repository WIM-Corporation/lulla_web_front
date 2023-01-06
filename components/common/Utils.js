export const errMsg = (prefix, err) => {
  const detailMsg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(err.message) ? err.message : "";
  return `${prefix}
    ${detailMsg}`;
};

export function encodeImage(data) {
  try {
    if (data.startsWith("data:image/*;base64,")) {
      console.log("Already encoded image string");
      return;
    }
    /* TODO: in case of video */
    const base64Img = data.replace(/\n/g, "").replace(/\s*/g, "");
    return "data:image/*;base64," + base64Img;
  } catch (error) {
    console.log("이미지 데이터가 아닙니다");
    return;
  }
}
