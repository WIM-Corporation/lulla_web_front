import axios from "axios";
import { useState, useEffect } from "react";

import useStores from "@/stores/useStores";
import InvitationCarousel, { InvitationLayout } from "./InvitationCarousel";

export default function Invitation(props) {
  const { authStore } = useStores();

  const [isLoaded, setIsLoaded] = useState(false);
  const [inviteList, setInviteList] = useState([]);

  useEffect(() => {
    if (!isLoaded) {
      // API 통신
      auth = window.getAuth();
      console.log(auth);
      axios({
        method: "post",
        url: "/api/v1/invite/list",
        headers: { Authorization: "Bearer " + auth },
      })
        .then(({ data: respData }) => {
          console.log(respData);
          if (respData.resultCode == 1) {
            // 성공한 경우
            setInviteList(respData.data.invite_list);
          } else {
            console.warn(respData);
            alert(respData.message);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
        });
      setIsLoaded(true);
    }
  }, []);

  return (
    <main>
      {inviteList.length > 1 ? (
        <InvitationCarousel invitations={inviteList} />
      ) : inviteList.length == 1 ? (
        <InvitationLayout {...inviteList[0]} />
      ) : (
        <main style={{ padding: "200px" }}>도착한 초대장이 없습니다.</main>
      )}
    </main>
  );
}
