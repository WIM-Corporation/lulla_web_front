export function getQueryParams() {
  var a = window.location.search.substr(1).split("&");
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split("=", 2);
    if (p.length == 1) b[p[0]] = "";
    else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
}

export function checkingDeviceType() {
  const qso = getQueryParams();
  let deviceType = "web";
  if (qso.type == "ios") deviceType = "ios";
  if (qso.type == "android") deviceType = "android";

  setTimeout((t) => {
    if (deviceType == "ios") {
      window.webkit.messageHandlers.pageLoaded.postMessage("");
    } else if (deviceType == "android") {
      window.app.pageLoaded();
    } else {
      console.error("이기능은 앱에서 정상작동합니다.");
    }
  }, 300);

  return deviceType;
}

/* back To Native */
export function backToNative(deviceType) {
  if (deviceType == "android") {
    window.app.cancel();
  } else if (deviceType == "ios") {
    window.webkit.messageHandlers.cancel.postMessage("");
  } else {
    alert("이 기능은 앱에서만 동작합니다.");
  }
}

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
