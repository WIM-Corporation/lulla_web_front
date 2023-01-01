import DefaultNav from "@/components/Layouts/DefaultNav";
import NavHeader from "@/components/Layouts/NavHeader";
import useStores from "@/stores/useStores";
import Contents from "@/components/OwnerSetting/Invitation/Teacher/Contents";

export default function InvitationTeacher(props) {
  const { authStore } = useStores();

  return (
    <div className="Wrap side_layout">
      <DefaultNav />
      <div className="container">
        <NavHeader />
        <Contents />
      </div>
    </div>
  );
}
