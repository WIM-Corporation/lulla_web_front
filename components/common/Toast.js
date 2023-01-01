import useStores from "@/stores/useStores";
import { observer } from "mobx-react-lite";

const Index = observer(() => {
  const { globalStore } = useStores();
  const msg = globalStore.toastMsg;

  return (
    <>
      <div className="invite_excess" hidden={!globalStore.toastActive}>
        {msg}
      </div>
      <style jsx>{`
        .invite_excess {
          top: 50%;
          left: 50%;
          // left: calc(50% + 120px);
          color: #fff;
          padding: 12px 32px;
          z-index: 4;
        }
      `}</style>
    </>
  );
});

const Toast = () => <Index />;
export default Toast;
