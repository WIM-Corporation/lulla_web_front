import dynamic from "next/dynamic";
import useStores from "@/stores/useStores";
import PageLoading from "@/components/PageLoading";
import NotAllowed from "@/components/NotAllowed";

const Index = dynamic(() => import("@/components/App/Album/Index"), {
  loading: () => <PageLoading />,
});

export default function Notice() {
  const {authStore} = useStores();

  return authStore.isAuth ? <Index /> : <NotAllowed />;
}
