import { useRouter } from "next/router";
import { useState } from "react";

import useStores from "@/stores/useStores";
import ProfileMenu from "./ProfileMenu";
import { observer } from "mobx-react-lite";

const NavHeaderComponent = observer(({ hasLogo }) => {
  const router = useRouter();
  const { authStore } = useStores();

  const [isOpen, setIsOpen] = useState(false);

  const handleClickLogout = (e) => {
    authStore.signOut();
    router.replace("/");
  };

  return (
    <>
      <header>
        {hasLogo && (
          <a href="/notice" className="logo">
            <img src="/imgs/logo.png" />
          </a>
        )}
        <div className="main_hd sub_hd">
          <ul className="hd_content">
            <li className="hd_item">
              <input type="search" className="search_box" />
              <button type="button" className="search_btn"></button>
            </li>
            <li className="hd_item">
              <a href="javascript:void(0);" className="item_btn notice"></a>
            </li>
            <li className="hd_item">
              <a href="javascript:void(0);" className="item_btn message"></a>
            </li>
            <li className="hd_item">
              <a
                href="javascript:void(0);"
                className="item_btn profile"
                onClick={(e) => setIsOpen(!isOpen)}
              >
                <img
                  src={
                    authStore.curMember && authStore.curMember.member_image
                      ? authStore.curMember.member_image
                      : "/imgs/profile-m.png"
                  }
                  style={{
                    width: 36,
                    height: 36,
                    overflow: "hidden",
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                  }}
                />
              </a>
              <ProfileMenu
                isOpen={isOpen}
                handleOpen={setIsOpen}
                handleClickLogout={handleClickLogout}
              />
            </li>
          </ul>
        </div>
      </header>
      <style jsx>{`
        header {
          position: sticky;
          top: 0;
          z-index: 2;
          background-color: var(--white);
        }
      `}</style>
    </>
  );
});

const NavHeader = (props) => <NavHeaderComponent {...props} />;
export default NavHeader;
