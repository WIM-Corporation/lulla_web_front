import axios from "axios";
import { useEffect, useState } from "react";
import classnames from "classnames";

export default function SelectSido(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidoList, setList] = useState([{ id: "", name: "시도" }]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect((e) => {
    // API 통신
    function loadData() {
      axios({
        method: "post",
        url: "/api/v1/address/sido/list",
      })
        .then(({ data: respData }) => {
          console.log(respData);
          if (respData.resultCode == 1) {
            // 성공한 경우
            console.log([{ id: "", name: "시도" }, ...respData.data]);
            setList([{ id: "", name: "시도" }, ...respData.data]);
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
    if (sidoList.length == 1) loadData();
  }, []);

  useEffect(
    (e) => {
      // console.log(props.selectedSido);
      const idx = sidoList.findIndex((item) => item.id == props.selectedSido);
      if (idx > -1) {
        setSelectedIndex(idx);
      }
    },
    [props.selectedSido]
  );

  const handleChange = (e) => {
    const listIndex = e.target.getAttribute("data-idx");
    // console.log(listIndex);
    props.onSelect(sidoList[listIndex].id);
    setSelectedIndex(listIndex);
    setIsOpen(false);
  };

  const handleComboToggle = (e) => setIsOpen(!isOpen);

  return (
    <>
      <div
        className={classnames({
          combo_select: true,
          country_1: true,
          on: isOpen,
        })}
        onClick={handleComboToggle}
      >
        <p className="select_value">{sidoList[selectedIndex].name}</p>
        <ul
          className={classnames({
            select_list: true,
            country_list: true,
            on: isOpen,
          })}
        >
          {/* <li className="select_item country_item" onClick={handleComboToggle}>
            {sidoList[0].name}
          </li> */}
          {sidoList.map((item, idx) => (
            <li
              className="select_item country_item"
              key={item.id}
              data-idx={idx}
              onClick={handleChange}
              // selected={item.id == props.selectedSido}
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
