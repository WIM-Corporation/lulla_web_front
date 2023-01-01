import dynamic from "next/dynamic";
import PageLoading from "@/components/PageLoading";

const Edit = dynamic(() => import("@/components/Member/Account/Edit"), {
  loading: () => <PageLoading />,
});

export default () => {
  return <Edit />;
};
