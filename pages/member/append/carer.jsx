import dynamic from "next/dynamic";
import useStores from "@/stores/useStores";
import PageLoading from "@/components/PageLoading";
import NotAllowed from "@/components/NotAllowed";
import {observer} from "mobx-react-lite";

const Index = dynamic(
  () => import("@/components/Member/Append/Carer/Index.jsx"),
  {loading: () => <PageLoading />}
);

const ObserverComponent = observer((prop) => {
  const {authStore} = useStores();

  // return authStore.isAuth ? (
  return <Index />;
  // ) : (
  //   <NotAllowed/>
  // );
});

const CarerCreate = () => <ObserverComponent />;

export default CarerCreate;
