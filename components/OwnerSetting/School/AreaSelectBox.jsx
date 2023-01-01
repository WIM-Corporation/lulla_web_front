import classnames from "classnames";
import { req } from "@/lib/apiUtil";
import { useOpen } from "@/lib/hooks/useOpen";
import { useState, useEffect, useMemo } from "react";

export default ({ sido, sigungu, handleChangeArea }) => {
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const curSidoItem = useMemo(() => {
    const val = sidoList.find((v) => v.id === sido.id);
    handleChangeArea("sido", { ...sido, name: val });
    return val;
  }, [sido.id, sidoList]);
  const curSigunguItem = useMemo(() => {
    const val = sigunguList.find((v) => v.id === sigungu.id);
    handleChangeArea("sigungu", { ...sigungu, name: val });
    return val;
  }, [sido.id, sigunguList, sigungu.id]);
  const { ref: sidoRef, open: sidoOpen, setOpen: setSidoOpen } = useOpen("ul");
  const {
    ref: sigunguRef,
    open: sigunguOpen,
    setOpen: setSigunguOpen,
  } = useOpen("ul", !!!curSigunguItem);

  const handleOpen = (name, state) => {
    if (name === "sido") {
      setSidoOpen(state ?? !sidoOpen);
    } else if (name === "sigungu") {
      if (sigunguList.length === 0) getSigungu();
      setSigunguOpen(state ?? !sigunguOpen);
    }
  };

  const getSido = async () => {
    const sidoRes = await req("/api/v1/address/sido/list", {
      method: "post",
    }).catch((err) => console.warn(err));

    if (sidoRes && sidoRes.data.resultCode > 0) setSidoList(sidoRes.data.data);
  };

  const getSigungu = async (sidoId) => {
    if (!sidoId) return;

    const sigunguRes = await req("/api/v1/address/sigungu/list", {
      method: "post",
      data: {
        id: sidoId,
      },
    }).catch((err) => console.warn(err));

    if (sigunguRes && sigunguRes.data.resultCode > 0)
      setSigunguList(sigunguRes.data.data);
  };

  useEffect(() => {
    if (sidoList.length === 0) getSido();
    getSigungu(sido?.id);
  }, [sido]);

  return (
    <>
      <div className="manadate_midbox">
        <div
          className={classnames({
            adm_selectBox: true,
            on: sidoOpen,
          })}
          onClick={() => handleOpen("sido")}
        >
          <div className="adm_valueBox warning">
            <div className="adm_select_value">
              {curSidoItem?.name ?? "시도"}
            </div>
          </div>
          {sidoOpen && (
            <ul className="adm_select_list3" ref={sidoRef}>
              {sidoList.map((v) => (
                <li
                  key={v.id}
                  className={classnames({
                    adm_select_item: true,
                    active: sido.id === v.id,
                  })}
                  onClick={() => {
                    getSigungu(v.id);
                    handleChangeArea("sido", v, {
                      sigungu: { id: "", name: "" },
                    });
                    handleOpen("sido", false);
                    handleOpen("sigungu", true);
                  }}
                >
                  <p>{v.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={classnames({
            adm_selectBox: true,
            on: sigunguOpen,
          })}
        >
          <div
            className="adm_valueBox"
            onClick={() => handleOpen("sigungu", true)}
          >
            <div className="adm_select_value">
              {curSigunguItem?.name ?? "시군구"}
            </div>
          </div>
          {sigunguOpen && (
            <ul className="adm_select_list3" ref={sigunguRef}>
              {sigunguList.map((v) => (
                <li
                  key={v.id}
                  className={classnames({
                    adm_select_item: true,
                    active: sigungu.id === v.id,
                  })}
                  onClick={() => {
                    handleChangeArea("sigungu", v);
                    handleOpen("sigungu", false);
                  }}
                >
                  <p>{v.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style jsx>{`
        .adm_select_list3 {
          max-height: 250px;
        }
        .active {
          background-color: var(--gray10);
        }
      `}</style>
    </>
  );
};
