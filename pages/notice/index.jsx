import dynamic from 'next/dynamic';
import useStores from "@/stores/useStores";
import PageLoading from '@/components/PageLoading';
import NotAllowed from '@/components/NotAllowed';
import { observer } from 'mobx-react-lite';

const Index = dynamic(
  () => import("@/components/Notice/Index.jsx"),
  {
    loading: () => <PageLoading />,
  }
);

const ObserverComponent = observer( props => {
  const {authStore} = useStores();

  return authStore.isAuth ? <Index /> : <NotAllowed />;
});

const Notice = props => <ObserverComponent {...props} />;

export default Notice;
