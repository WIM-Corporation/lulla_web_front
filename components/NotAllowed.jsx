import Link from 'next/link';

const NotAllowed = () => {
  return (
    <div style={ {padding: "100px"} }>
      <h1>
        <Link href="/auth/signin">로그인</Link>
        이 필요한 페이지 입니다.
      </h1>
      <hr />
      <br />
      <Link href="/">홈으로</Link>
    </div>
  );
}

export default NotAllowed;