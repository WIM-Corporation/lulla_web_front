import Head from "next/head";
import { useRouter } from "next/router";
import Script from 'next/script'

export default function InviteCodePage(props) {
    const inviteCode = useRouter().query.code;
    // console.log(inviteCode);
    const router = useRouter();
    const userAgent = navigator.userAgent;

    return (
        <div id="INVITE">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>Lulla ~ 모두가 행복한 유아의 성장, 랄라</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/css/invite/code.css"></link>
            </Head>

            <div className="invite-logo"><img src="/imgs/lulla_logo_primary.png" width="132" /></div>

            <div className="invite-title">유아의 행복한 성장을<br />든든하게 돕습니다.</div>

            <div className="invite-description">랄라는 교사와 학부모간 연결을 통해<br />더욱 쉽고 빠른 원 관리를 할 수 있도록 돕는<br />교육 서비스 입니다.</div>

            <div className="invite-store-wrap">
                <span><img src="/imgs/google_play.png" height="60" onClick={function () {
                    if (userAgent.includes("Android")) {
                        router.push("market://launch?id=com.lullaapp.android")
                    }
                }} /></span>

                <span><img src="/imgs/app_store.png" height="60" onClick={() =>
                    location.href = "itms-apps://itunes.apple.com/app/id1539607986"
                } /></span>
            </div>


            <Script id="test-id" strategy="afterInteractive">
                {`
                    if (navigator.userAgent.includes("iPhone")) {
                        var visitedAt = (new Date()).getTime(); // 방문 시간
                        setTimeout(
                        function() {
                            if ((new Date()).getTime() - visitedAt < 2000) {
                                location.href = "itms-apps://itunes.apple.com/app/id1539607986";
                            }
                        }, 500);
                        
                        setTimeout(function() { 
                            location.href = "lulla://open";
                        }, 0);

                    }
            `}

            </Script>


        </div>
    )
}
