import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Head from "next/head";
import { useRouter } from "next/router";

import "@/styles/global.css";
import MobXStoresContext from "@/stores/MobXStoreContext.js";
import globalStore from "@/stores/globalStore";
import authStore from "@/stores/Auth";
import joinStore from "@/stores/joinStore";
import reportStore from '@/stores/reportStore';
import { useState } from "react";
import { useEffect } from "react";
import Toast from "@/components/common/Toast";
import Edit from "@/components/Member/Account/Edit";
import ChangeProfile from "@/components/Member/ChangeProfile";
import useStores from "@/stores/useStores";

const fireApp = initializeApp({
  apiKey: "AIzaSyDFlxKc7Wzyn6ZMGvJUh9MnfJMcKb0nbRE",
  authDomain: "lullatest.firebaseapp.com",
  databaseURL: "https://lullatest.firebaseio.com",
  projectId: "lullatest",
  storageBucket: "lullatest.appspot.com",
  messagingSenderId: "679530149171",
  appId: "1:679530149171:web:c3bfd28310724034ce3a46",
  measurementId: "G-6YS1NYBYBJ",
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathPrefix = "/" + router.pathname.replace("/", "").split("/")[0];
  switch (pathPrefix) {
    case "/":
      import("@/styles/index.scss");
      break;
    case "/app":
    case "/app/album":
      import("@/styles/album.scss");
      break;
  }

  // 주입할 전역 MobX Store들
  const initStores = {
    authStore,
    globalStore,
    // authStore,
    joinStore,
    reportStore,
  };

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  // if (typeof window !== "undefined") {
  //   window.addEventListener("load", function () {
  //     // 페이지가 처음 로드 되면
  //     // 자동로그인 체크
  //     authStore.autoLoginProcess(() => {
  //       try {
  //         if (
  //           window.location.protocol == "http:" &&
  //           window.location.hostname != "localhost"
  //         )
  //           return;
  //         const messaging = getMessaging(fireApp);
  //         // 메세지 수신시 설정
  //         onMessage(messaging, (payload) => {
  //           console.log("Message received. ", payload);
  //         });
  //         // 토큰 가져오기
  //         const vapidKey =
  //           "BAP3vmFNxf467GzHXBIywevZMjIl-qqb7IkKmOC63KMZ2R581unvFbypiMiMLTNTBgCaduZ0Hl_Rxv2QCe9p3ng";
  //         getToken(messaging, { vapidKey })
  //           .then((currentToken) => {
  //             if (currentToken) {
  //               console.log("currentToken:", currentToken);
  //               const savedFcmToken = window.localStorage.getItem("fcmToken");
  //               if (savedFcmToken && savedFcmToken == currentToken) {
  //               } else {
  //                 window.localStorage.setItem("fcmToken", currentToken);
  //                 // 토큰 서버 저장 요청
  //                 axios({
  //                   method: "POST",
  //                   url: "/api/v1/auth/fcm",
  //                   headers: { Authorization: "Bearer " + authStore.authToken },
  //                   data: { token: currentToken, device: 3 },
  //                 }).catch((err) => console.error(err));
  //               }
  //             } else {
  //               // Show permission request UI
  //               console.log(
  //                 "No registration token available. Request permission to generate one."
  //               );
  //             }
  //           })
  //           .catch((err) =>
  //             console.log("An error occurred while retrieving token. ", err)
  //           );
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     });
  //   });
  // }

  return !isSSR ? (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Lulla ~ 모두가 행복한 유아의 성장, 랄라</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <MobXStoresContext.Provider value={initStores}>
        <Component {...pageProps} />
        <Edit />
        <ChangeProfile />
        <Toast />
      </MobXStoresContext.Provider>
    </>
  ) : null;
}
