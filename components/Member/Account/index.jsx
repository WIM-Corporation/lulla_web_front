
import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import useStores from "@/stores/useStores";
import Contents from "./Contents";

export default function Account(props) {
  const { authStore } = useStores();

  // TODO 1. 계정이 하나도 없을때
  // 2. 기존에 선택된 계정이 없을때
  // 3. 기존에 선택된 계정이 있을때 (*)
  // 4. 기존 선택된 계정이 정지/삭제 된 경우??

  // console.log(authStore);

  // 1 원장님 / 관리자(별도?)
  // 2 선생님
  // 3 보호자
  // 4 가족

  return (
    <div className="Wrap side_layout">
      <AccountNav />
      <div className="container">
        <NavHeader />
        <Contents />
      </div>
    </div>
  );
}
