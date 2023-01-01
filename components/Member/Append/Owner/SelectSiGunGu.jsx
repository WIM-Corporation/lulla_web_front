import axios from "axios";
import { useEffect, useState, useRef } from "react";
import classnames from "classnames";

export default function SelectSiGunGu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [sigunguList, setList] = useState([{ id: "", name: "시군구" }]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef(null);

  useEffect(
    (e) => {
      // API 통신
      function loadData() {
        // console.log("시군구 데이터 불러오기");
        axios({
          method: "post",
          url: "/api/v1/address/sigungu/list",
          data: { id: props.selectedSido },
        })
          .then(({ data: respData }) => {
            console.log(respData);
            if (respData.resultCode == 1) {
              // 성공한 경우
              setList([{ id: "", name: "시군구" }, ...respData.data]);
              // setSelectedIndex(0);
              // props.onSelect("");
            } else {
              console.warn(respData);
              alert(respData.message);
            }
          })
          .catch((err) => {
            console.error(err);
            alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
          });
      }
      if (!props.selectedSido) setList([{ id: "", name: "시군구" }]);
      if (props.selectedSido) loadData();
      setSelectedIndex(0);
      setIsOpen(false);
      if (ref.current) ref.current.scroll({ top: 0 });
    },
    [props.selectedSido]
  );

  useEffect(
    (e) => {
      // console.log(props.selectedSigungu);
      function loadData(timeout) {
        axios({
          method: "post",
          url: "/api/v1/address/sigungu/list",
          data: { id: props.selectedSido },
        })
          .then(({ data: respData }) => {
            //console.log(respData);
            if (respData.resultCode == 1) {
              // 성공한 경우
              const newList = [{ id: "", name: "시군구" }, ...respData.data];
              setList(newList);
              const idx = newList.findIndex(
                (item) => item.id == props.selectedSigungu
              );
              if (idx > -1) {
                // console.log(idx);
                setSelectedIndex(idx);
              }
            } else {
              console.warn(respData);
              alert(respData.message);
            }
          })
          .catch((err) => {
            console.error(err);
            alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
          });
      }
      if (props.selectedSigungu) setTimeout(loadData, 300);
    },
    [props.selectedSigungu]
  );

  const handleChange = (e) => {
    const listIndex = e.target.getAttribute("data-idx");
    // console.log(listIndex);
    props.onSelect(sigunguList[listIndex].id);
    setSelectedIndex(listIndex);
    setIsOpen(false);
  };

  const handleComboToggle = (e) => {
    if (!props.selectedSido) return;
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={classnames({
          combo_select: true,
          country_2: true,
          on: isOpen,
        })}
        onClick={handleComboToggle}
        // defaultValue={props.selectedSigungu}
      >
        <p className="select_value">{sigunguList[selectedIndex].name}</p>
        <ul
          className={classnames({
            select_list: true,
            country_list: true,
            on: isOpen,
          })}
          ref={ref}
        >
          {/* <li
          className="select_item country_item"
          onClick={handleComboToggle}
        >{ sigunguList[0].name }</li> */}
          {sigunguList.map((item, idx) => (
            <li
              className="select_item country_item"
              key={item.id}
              data-idx={idx}
              onClick={handleChange}
              // selected={item.id == props.selectedSigungu}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .combo_select {
          cursor: pointer;
        }

        ul {
          max-height: 254px;
        }
      `}</style>
    </>
  );
}
