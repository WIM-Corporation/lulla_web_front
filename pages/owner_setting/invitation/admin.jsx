import dynamic from "next/dynamic";
import useStores from "@/stores/useStores";
import PageLoading from "@/components/PageLoading";
import NotAllowed from "@/components/NotAllowed";
import { observer } from "mobx-react-lite";

const Index = dynamic(
  () => import("@/components/OwnerSetting/Invitation/Admin/index.jsx"),
  {
    loading: () => <PageLoading />,
  }
);

const ObserverComponent = observer((prop) => {
  const { authStore } = useStores();

  return authStore.isAuth ? <Index /> : <NotAllowed />;
});

const AdminInvitation = () => <ObserverComponent />;

export default AdminInvitation;
