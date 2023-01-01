import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import ImgLogo from "../assets/imgs/logo.webp";
import ImgLandingTitle from "../assets/imgs/illust-landing-fmaily.png";
import ImgLandingNotice from "../assets/imgs/image-landing-notice.png";
import ImgLandingQuickview from "../assets/imgs/image-landing-notifi.png";
import ImgLandingAlbum from "../assets/imgs/image-landing-album.png";
import ImgLandingChat from "../assets/imgs/image-landing-chat.png";
import ImgBtnAppstore from "../assets/imgs/btn-appstore.png";
import ImgBtnGooglePlay from "../assets/imgs/btn-googleplay.png";
import TopMenuAuth from "@/components/Home/TopMenuAuth";

function Home() {
  const router = useRouter();

  return (
    <>
      <div id="RANDING">
        <div id="HEADER">
          <div className="container">
            <div className="logo">
              <Image src={ImgLogo} alt="로고" width="80" height="36" />
            </div>
            <TopMenuAuth />
          </div>
        </div>
        {/* 비주얼 영역 */}
        <div className="visual-section">
          <div className="container">
            <div className="left-wrap">
              <h1>
                유아의 <strong>행복한 성장</strong>을<br />
                <strong>든든하게</strong> 돕습니다.
              </h1>
              <h2>
                랄라는 선생님과 부모님의 원활한 의사소통과
                <br />
                편리한 기관 운영을 돕는 교율 서비스 플랫폼 입니다.
              </h2>
              <div>
                <Link href="/notice">시작하기</Link>
              </div>
            </div>

            <div className="right-img-wrap">
              <Image src={ImgLandingTitle} alt="비주얼 이미지" />
            </div>
          </div>
        </div>
        {/* 공지사항 섹션 */}
        <div className="sections notice-section">
          <div className="container">
            <div className="left-contants">
              <h1>공지사항</h1>
              <h2>
                선생님과
                <br />
                부모님들에게
                <br />
                친화적인 타임라인
              </h2>
              <div className="description">
                타임라인 방식으로 더욱 세련되고 편리해진
                <br />
                랄라의 공지사항을 경험해 보세요.
              </div>
            </div>
            <div className="desc-photo">
              <Image
                src={ImgLandingNotice}
                width={618}
                height={436}
                alt="공지사항 스크린샷"
              />
            </div>
            <div className="right-video-wrap">
              <video
                width="500"
                autoPlay={true}
                loop={true}
                src="/video/notice.mp4"
              >
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </div>
        {/* 알림톡섹션 */}
        <div className="sections alarmtalk-section">
          <div className="container">
            <div className="left-contants">
              <h1>알림톡·새소식</h1>
              <h2>
                개별 원아 관리에 최적화된
                <br />
                강력하고 스마트한 알림
              </h2>
              <div className="description">
                업무 피로도는 덜고 효율성은 높이는 원아별 <br />
                관리에 최적화된 알림을 사용해보세요.
              </div>
            </div>
            <div className="desc-photo">
              <Image
                src={ImgLandingQuickview}
                width={391}
                height={562}
                alt="퀵뷰 스크린샷"
              />
            </div>
            <div className="right-video-wrap">
              <video
                width="600"
                autoPlay={true}
                loop={true}
                src="/video/quickview.mp4"
              >
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </div>
        {/* 앨범섹션 */}
        <div className="sections album-section">
          <div className="container">
            <div className="left-contants">
              <h1>앨범</h1>
              <h2>
                처음 경험하는
                <br />
                원아 사진 관리의
                <br />
                혁신적 변화
              </h2>
              <div className="description">
                AI 딥러닝 기반 안면 인식 기술을 적용하여
                <br />
                수많은 사진 속 원아를 자동으로 분류할 수 있어요.
              </div>
            </div>
            <div className="desc-photo">
              <Image
                src={ImgLandingAlbum}
                width={391}
                height={536}
                alt="앨범 스크린샷"
              />
            </div>
            <div className="right-video-wrap">
              <video
                width="500"
                autoPlay={true}
                loop={true}
                src="/video/album.mp4"
              >
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </div>
        {/* 채팅섹션 */}
        <div className="sections chatting-section">
          <div className="container">
            <div className="left-contants">
              <h1>대화</h1>
              <h2>
                선생님과 부모님을 위한
                <br />
                랄라톡의 특별한 대화
              </h2>
              <div className="description">
                기술적 감수성을 더한 랄라톡으로 원아의
                <br />
                행복한 일상과 성장을 공유하세요.
              </div>
            </div>
            <div className="desc-photo">
              <Image
                src={ImgLandingChat}
                width={391}
                height={536}
                alt="채팅 스크린샷"
              />
            </div>
            <div className="right-video-wrap">
              <video
                width="600"
                autoPlay={true}
                loop={true}
                src="/video/chat.mp4"
              >
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </div>
        {/* 스토어 섹션 */}
        <div className="store-section">
          <div className="container">
            <div className="store-links">
              <a
                href="https://apps.apple.com/us/app/lulla/id1539607986"
                target="_blank"
              >
                <Image
                  src={ImgBtnAppstore}
                  width={140}
                  height={44}
                  alt="앱스토어 링크 버튼"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.lullaapp.android"
                target="_blank"
              >
                <Image
                  src={ImgBtnGooglePlay}
                  width={158}
                  height={44}
                  alt="구글플레이 링크 버튼"
                />
              </a>
            </div>
            <h1>
              모두가 행복한 유아의 성장
              <br />
              2022년 <strong>랄라</strong>와 함께
            </h1>
            <div>
              <span>시작하기</span>
            </div>
          </div>
        </div>
        {/* 푸터 */}
        <div className="footer">
          <div className="container">
            <div className="rows">
              <span className="cols">
                <Image src={ImgLogo} alt="로고" width="80" height="36" />
              </span>
              <span className="cols">
                <b>서비스</b>
                <a>공지사항</a>
              </span>
              <span className="cols">
                <b>회사</b>
                <a>lulla 소개</a>
              </span>
              <span className="cols">
                <b>사용</b>
                <a>사용 가이드</a>
              </span>
              <span className="right-col">개인정보처리방침 이용약관</span>
            </div>
            <div className="copyright">
              ㈜ 랄라 &nbsp;|&nbsp; 대표 임걸 &nbsp;|&nbsp; 사업자 등록번호
              547-87-01479 &nbsp;|&nbsp; 서울특별시 광진구 능동로, 창의관 120호
              <br />
              Copyright © 2022 lulla inc., all rights reserved.
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .logo {
            position: relative;
            top: 0;
            left: 0;
          }
        `}
      </style>
    </>
  );
}

export default Home;
