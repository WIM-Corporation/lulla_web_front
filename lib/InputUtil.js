import regex from "@/assets/regex";

export const onChangeCondition = (name, value) => {
  // console.log(name, value);
  switch (name) {
    case "name":
      // 문자만 허용할 것(영어, 한국어)
      return value.replace(/[^a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
    case "phoneNumber":
      // 숫자와 '-' 이외의 문자를 허용하지 않을 것
      // 단 '-' 문자는 index 4, 8에만 허용할 것
      // '-'를 포함하여 13자리가 되면 더 이상의 입력을 허용히지 않을 것
      if (!/[^\d-]/.test(value) && value.length <= 13) {
        if (!value.includes("-") && value.length > 11) return false;
        return value
          .replace(/[^0-9]/g, "")
          .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
          .replace(/(\-{1,2})$/g, "");
      }
      return false;
    case "verificationCode":
      return value.replace(/[^0-9]/, "").substr(0, 4);
    case "tel":
      const nextVal = value
        .replace(/[^0-9]/g, "")
        .replace(
          /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
          "$1-$2-$3"
        )
        .replace("--", "-");
      const [first, second, third] = value.split("-");
      if (
        value.length > 13 ||
        (value.length >= 12 &&
          ((first.length === 2 && (second + third).length > 8) ||
            (first.length === 3 && (second + third).length > 8)))
      )
        return false;
      return nextVal.replace(regex.telephone, "$1-$2-$3");
    default:
      return value;
  }
};
