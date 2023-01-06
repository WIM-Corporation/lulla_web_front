import testImageData1 from "@/public/test/eximg1";
import testImageData2 from "@/public/test/eximg2";
import testImageData3 from "@/public/test/eximg3";

export default function TestBtnCombo({ testData, onClick, jsonData }) {
  const handleTestBtn = (e) => {
    setTimeout(function () {
      if (jsonData) {
        onClick(testData);
      } else {
        onClick(JSON.stringify(testData));
      }
    }, 3000);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "50px",
        left: "50%",
        transform: "translate(0, -50%)",
        zIndex: "5",
      }}
    >
      <button onClick={handleTestBtn}> 테스트</button>
    </div>
  );
}
export const dummyAITagResponse = {
  resultCode: 1,
  data: {
    class_id: "b0116956-18c7-4332-a483-f91d3ac04dde",
    tags: [
      // {
      //   kid_id: "407119b2-7141-11ec-9f4b-0242ac110003",
      //   // kid_name: "홍길동",
      //   class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
      //   // class_name: "포도반",
      //   bbox: [200, 100, 300, 150],
      // },
    ],
  },
};

export const dummyFromNativeData = {
  school_id: "57c040b0-2fed-11ec-819b-0242ac110003",
  class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
  total_medias: 10,
  medias: [
    {
      mime_type: "images/png",
      seq: 0,
      data: testImageData1,
      width: -1,
      height: -1,
      tags: [],
    },
    {
      mime_type: "images/png",
      seq: 1,
      data: testImageData2,
      width: -1,
      height: -1,
      tags: [
        {
          kid_id: "583bef38-9165-11ec-821f-0af154999872",
          kid_name: "또치",
          class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
          class_name: "포도반",
          bbox: [485, 280, 740, 500],
          by_user: true,
        },
      ],
    },
    // {
    //   seq: 1,
    //   data: null,
    //   width: -1,
    //   height: -1,
    //   media_type: "video/mp4",
    //   video_path: "https://www.w3schools.com/html/mov_bbb.mp4",
    // },
    // {
    //   seq: 2,
    //   data: null,
    //   width: -1,
    //   height: -1,
    //   media_type: "video/mp4",
    //   video_path: "/video/notice.mp4",
    // },
    // {
    //   seq: 3,
    //   data: null,
    //   width: -1,
    //   height: -1,
    //   media_type: "video/mp4",
    //   video_path: "/storage/emulated/0/DCIM/Camera/20221208_015652.mp4",
    // },
  ],
};

export const dummyErrorImageData = {
  school_id: "57c040b0-2fed-11ec-819b-0242ac110003",
  class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
  total_medias: 10,
  media: {
    seq: 2 /* 10번째 중 3번째 사진 오류 보내기 */,
    data: testImageData2,
    image_url:
      "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1671903341159__9594__.jpg",
    width: -1,
    height: -1,
    is_deleted: false,
    tags: [
      {
        kid_id: "407119b2-7141-11ec-9f4b-0242ac110003",
        kid_name: "홍길동",
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        class_name: "포도반",
        bbox: [300, 100, 500, 350],
        by_user: true,
      },
      {
        kid_id: "583bef38-9165-11ec-821f-0af154999872",
        kid_name: "또치",
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        class_name: "포도반",
        bbox: [485, 280, 740, 500],
        by_user: true,
      },
    ],
  },
};

export const dummyReportData = {
  album_id: "aaa",
  school_id: "57c040b0-2fed-11ec-819b-0242ac110003",
  class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
  total_medias: 10,
  report_id: "reporttest",
  reporter: {
    name: "홍길동",
    class_name: "햇님반",
    profile:
      "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1641728516061__3141__.jpg",
  },
  created_time: "2001-01-01T01:01:01.247Z",
  is_confirmed: false,
  content: "오류 리포트입니다. ",
  media: {
    seq: 2 /* 10번째 중 3번째 사진 오류 보내기 */,
    image_url:
      "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1671903341159__9594__.jpg",
    width: -1,
    height: -1,
    is_deleted: false,
    tags: [
      {
        kid_id: "407119b2-7141-11ec-9f4b-0242ac110003",
        kid_name: "홍길동",
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        class_name: "포도반",
        bbox: [300, 100, 500, 350],
        by_user: true,
      },
      {
        kid_id: "583bef38-9165-11ec-821f-0af154999872",
        kid_name: "또치",
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        class_name: "포도반",
        bbox: [485, 280, 740, 500],
        by_user: true,
      },
    ],
  },
};

export const dummyKidList = {
  resultCode: 1,
  message: "OK",
  data: {
    kid_list: [
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "3f359eb0-f184-11ec-8289-0af154999872",
        parnet_name: "포도반 홍길동(보호자)",
        kid_id: "407119b2-7141-11ec-9f4b-0242ac110003",
        kid_name: "홍길동",
        kid_image: "45fdf3d2-7141-11ec-a798-0242ac110003",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1641728515992__7672__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1641728516061__3141__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "7e71e068-9165-11ec-821f-0af154999872",
        parnet_name: "포도반 조커(포도반 조커 아)",
        kid_id: "583bef38-9165-11ec-821f-0af154999872",
        kid_name: "또치",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "421ac538-f184-11ec-8289-0af154999872",
        parnet_name: "포도반 둘리(보호자)",
        kid_id: "aca1cf20-f182-11ec-8289-0af154999872",
        kid_name: "둘리",
        kid_image: "c1420206-f182-11ec-8289-0af154999872",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1655830442226__4268__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1655830442335__3328__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "409d60b2-f184-11ec-8289-0af154999872",
        parnet_name: "포도반 둘재(보호자)",
        kid_id: "d475caa8-f180-11ec-8289-0af154999872",
        kid_name: "둘재",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "648edbd8-58ad-11ec-9f52-0242ac110003",
        parnet_name: "망고반 ()",
        kid_id: "648c18e4-58ad-11ec-aff6-0242ac110003",
        kid_name: null,
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "899185a0-5f44-11ec-aaab-0242ac110003",
        parnet_name: "망고반 뉴규(ㅇㅇ)",
        kid_id: "898d38c4-5f44-11ec-ac8e-0242ac110003",
        kid_name: "뉴규",
        kid_image: "914f45a2-5f44-11ec-af76-0242ac110003",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1639750818318__638__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1639750818396__6350__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "7a60d784-9162-11ec-821f-0af154999872",
        parnet_name: "망고반 지워니(망고반 지워니)",
        kid_id: "7a5f071a-9162-11ec-821f-0af154999872",
        kid_name: "지워니",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "5fa6ba78-5f1f-11ec-9362-0242ac110003",
        parnet_name: "자몽반 윈터(Mather)",
        kid_id: "8f06b576-5f1e-11ec-9cce-0242ac110003",
        kid_name: "윈터",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "399d4002-f184-11ec-8289-0af154999872",
        parnet_name: "자몽반 다서재(보호자)",
        kid_id: "1733aaca-f183-11ec-8289-0af154999872",
        kid_name: "다서재",
        kid_image: "1c8f3534-f183-11ec-8289-0af154999872",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1655830595461__3289__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1655830595566__4755__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "56bc68ec-018e-11ed-841e-0af154999872",
        parnet_name: "딸기반 T원아(보호자)",
        kid_id: "56bad78e-018e-11ed-841e-0af154999872",
        kid_name: "T원아",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "8f1683d2-027c-11ed-846e-0af154999872",
        parnet_name: "딸기반 김메건(보호자)",
        kid_id: "8f0eacfc-027c-11ed-846e-0af154999872",
        kid_name: "김메건",
        kid_image: "99103ab8-027c-11ed-846e-0af154999872",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1657696968325__8685__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1657696968404__3087__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "cb6f9cf2-c6bc-11ec-8252-0af154999872",
        parnet_name: "딸기반 김민지(김민지아빠)",
        kid_id: "6244c22a-c6bc-11ec-8252-0af154999872",
        kid_name: "김민지",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "0fae60c6-e0a6-11ec-8263-0af154999872",
        parnet_name: "딸기반 테스트(보호자)",
        kid_id: "4b763b7c-e0a3-11ec-8263-0af154999872",
        kid_name: "테스트",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "58c42dc0-fdc9-11ec-83b4-0af154999872",
        parnet_name: "딸기반 T원아()",
        kid_id: "58c42dbf-fdc9-11ec-83b4-0af154999872",
        kid_name: "T원아",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "1c76037c-f9c6-11ec-82c2-0af154999872",
        parnet_name: "딸기반 T원아()",
        kid_id: "1c76037b-f9c6-11ec-82c2-0af154999872",
        kid_name: "T원아",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "a49e9b5e-fdc9-11ec-83b4-0af154999872",
        parnet_name: "딸기반 T원아()",
        kid_id: "a49e9b5d-fdc9-11ec-83b4-0af154999872",
        kid_name: "T원아",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "36177da8-f184-11ec-8289-0af154999872",
        parnet_name: "사과반 일곱재(보호자)",
        kid_id: "8ef63bcc-f183-11ec-8289-0af154999872",
        kid_name: "일곱재",
        kid_image: "93e3f264-f183-11ec-8289-0af154999872",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1655830795700__873__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1655830795780__7129__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "13075dfc-e166-11ec-8264-0af154999872",
        parnet_name: "사과반 왕이런(보호자)",
        kid_id: "1305b092-e166-11ec-8264-0af154999872",
        kid_name: "왕이런",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "34afab8e-f184-11ec-8289-0af154999872",
        parnet_name: "사과반 첫째(보호자)",
        kid_id: "2cea590c-f180-11ec-8289-0af154999872",
        kid_name: "첫째",
        kid_image: "4e2ac4c6-f180-11ec-8289-0af154999872",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1655829390199__9847__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1655829390305__7494__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "5c22a42e-5f84-11ec-9b85-0242ac110003",
        parnet_name: "사과반 장승빈()",
        kid_id: "5c202a6e-5f84-11ec-be93-0242ac110003",
        kid_name: "장승빈",
        kid_image: "79ece686-5f84-11ec-8655-0242ac110003",
        kid_image_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/lulla_1639778266696__6887__.jpg",
        kid_thumb_url:
          "https://s3lulla.s3.ap-northeast-2.amazonaws.com/thumb_1639778266844__231__.jpg",
      },
      {
        class_id: "95c86cb2-7006-11ec-b270-0242ac110003",
        parnet_id: "901e2894-5bf0-11ec-9e55-0242ac110003",
        parnet_name: "사과반 원아(보호자)",
        kid_id: "901a60a6-5bf0-11ec-8529-0242ac110003",
        kid_name: "원아",
        kid_image: null,
        kid_image_url: null,
        kid_thumb_url: null,
      },
    ],
    class_list: [
      {
        id: "344a5038-383c-11ec-a521-0242ac110003",
        name: "사과반",
      },
      {
        id: "3e57b64c-383c-11ec-9941-0242ac110003",
        name: "자몽반",
      },
      {
        id: "4f188052-30cf-11ec-b05a-0242ac110003",
        name: "망고반",
      },
      {
        id: "95c86cb2-7006-11ec-b270-0242ac110003",
        name: "포도반",
      },
      {
        id: "397a0c2e-c6bc-11ec-8252-0af154999872",
        name: "딸기반",
      },
    ],
  },
};
