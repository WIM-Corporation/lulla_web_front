import axios from "axios";
import { useState } from "react";
import classnames from "classnames";
import useStores from "@/stores/useStores";
import { useOpen } from "@/lib/hooks/useOpen";
// import SuccessPopup from "./SuccessPopup";

export default function CreateCarerForm() {
  const { authStore } = useStores();

  const [inSchoolName, setInSchoolName] = useState("랄라");
  const [searchedSchoolList, setSearchedSchoolList] = useState([]);
  const [selectSchoolId, setSelectSchoolId] = useState("");

  const [inClassList, setInClassList] = useState([]);
  const [selectClassIdx, setSelectClassIdx] = useState(-1);

  const [isOpen, setIsOpen] = useState(false);

  const {
    open: isOpenClassList,
    setOpen: setIsOpenClassList,
    ref,
  } = useOpen("ul");

  const handleSearchSchool = (e) => {
    if (inSchoolName.length < 2) {
      alert("두자이상입력");
      return;
    }
    // API 통신
    axios({
      method: "post",
      url: "/api/v1/school/list",
      data: { name: inSchoolName },
    })
      .then(({ data: respData }) => {
        //console.log(respData);
        if (respData.resultCode == 1) {
          // 성공한 경우
          setSearchedSchoolList(respData.data.school_list);
        } else {
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };
  const handleChangeSchool = (e) => {
    const school_id = e.target.value;
    setSelectSchoolId(school_id);
    // console.log( school_id );
    axios({
      method: "post",
      url: "/api/v1/class/list",
      data: { school_id },
    })
      .then(({ data: respData }) => {
        if (respData.resultCode == 1) {
          // 성공한 경우
          setInClassList(respData.data.class_list);
        } else {
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };

  /* 반선택시 */
  const handleSelectClass = (e) => {
    const idx = e.target.getAttribute("data-idx");
    setSelectClassIdx(idx);
    setIsOpenClassList(false);
  };

  const handleClickRegister = (e) => {
    const school_id = selectSchoolId;
    const class_id = inClassList[selectClassIdx].id;
    // TODO 유효성 검사 필요
    axios({
      method: "post",
      url: "/api/v1/demand/teacher",
      headers: { Authorization: "Bearer " + authStore.authToken },
      data: { school_id, class_id },
    })
      .then(({ data: respData }) => {
        console.log(respData);
        if (respData.resultCode == 1) {
          setIsOpen(true);
          // alert("기관에 승인 요청을 성공적으로 보냈습니다.");
          // 성공한 경우
          // TODO팝업 오픈?
        } else {
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };

  return (
    <main>
      <div className="title_box">
        <p className="title">원아 등록</p>
      </div>
      <section className="sec_1">
        <ul className="info_form">
          <li className="info_list">
            <p className="rg_subtitle">
              정보 입력 <span>등록 후 자동으로 초대 요청이 진행됩니다.</span>
            </p>
          </li>
          {/* <li className="info_list">
            <div className="flex_box won_box">
              <input type="search" className="info_input won_search" placeholder="원 검색"/>
              <button type="button" className="won_search_btn">
                <img src="/imgs/search-s.png"/>
              </button>
            </div>
          </li> */}
          <li className="info_list">
            <div className="flex_box won_box on">
              <input
                type="search"
                className="info_input won_search on"
                defaultValue={inSchoolName}
                onChange={(e) => setInSchoolName(e.target.value)}
              />
              <button
                type="button"
                className="won_search_btn on"
                onClick={handleSearchSchool}
              >
                <img src="/imgs/search-s.png" />
              </button>
            </div>
          </li>

          <li className="info_list">
            <div className="flex_box country_box">
              {searchedSchoolList.length > 0 && (
                <select className="info_input" onChange={handleChangeSchool}>
                  <option value="0">선택하세요</option>
                  {searchedSchoolList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </li>

          <li className="info_list">
            <div className="flex_box ban_box">
              <div
                className={classnames({
                  combo_select: true,
                  on: isOpenClassList,
                })}
              >
                <p
                  className="select_value"
                  onClick={(e) => setIsOpenClassList(!isOpenClassList)}
                >
                  {selectClassIdx < 0
                    ? "반 선택"
                    : inClassList[selectClassIdx].name}
                </p>
                <ul
                  className={classnames({
                    select_list: true,
                    ban_list: true,
                    on: isOpenClassList,
                  })}
                  ref={ref}
                >
                  <li className="select_item ban_item">반 선택</li>
                  {inClassList.map((item, idx) => (
                    <li
                      key={item.id}
                      className="select_item ban_item"
                      data-idx={idx}
                      onClick={handleSelectClass}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          <li className="info_list">
            <input type="text" className="info_input" placeholder="이름" />
          </li>
          <li className="info_list">
            <div>
              <div
                className={
                  "date_input_box request_input rg_date_box " +
                  classnames({ warning: false })
                }
              >
                <input
                  type="text"
                  name="birthYear"
                  className="date_input_text"
                  placeholder="출생연도"
                  value=""
                />
                <input
                  type="text"
                  name="birthMonth"
                  className="date_input_text"
                  placeholder="월"
                  value=""
                />
                <input
                  type="text"
                  name="birthDate"
                  className="date_input_text"
                  placeholder="일"
                  value=""
                />
              </div>
              {/* <p className="warning_text wr_account">
                유효한 날짜를 입력해주세요.
              </p> */}
            </div>
          </li>
          <li className="info_list">
            <div className="flex_box">
              <div className="rg_radio_box">
                <input
                  type="radio"
                  className="rg_radiobtn"
                  id="rg_option1"
                  name="rg_gender"
                  value="option1"
                />
                <label for="rg_option1">여</label>
              </div>
              <div className="rg_radio_box">
                <input
                  type="radio"
                  className="rg_radiobtn"
                  id="rg_option2"
                  name="rg_gender"
                  value="option2"
                />
                <label for="rg_option2">남</label>
              </div>
            </div>
          </li>
          <li className="info_list">
            <p className="rg_subtitle">보호자님 정보</p>
          </li>
          <li className="info_list">
            <div className="flex_box">
              <div className="rg_radio_box">
                <input
                  type="radio"
                  className="rg_radiobtn"
                  id="rg_option3"
                  name="rg_radio"
                  value="option1"
                />
                <label for="rg_option3">엄마</label>
              </div>
              <div className="rg_radio_box">
                <input
                  type="radio"
                  className="rg_radiobtn"
                  id="rg_option4"
                  name="rg_radio"
                  value="option2"
                />
                <label for="rg_option4">아빠</label>
              </div>
            </div>
          </li>
          <li className="info_list">
            <input
              type="text"
              className="info_input"
              placeholder="예) 할머니, 할아버지, 고모, 이모 ..."
            />
          </li>
          <li className="info_list">
            <button
              type="button"
              className="info_btn registration_btn"
              onClick={handleClickRegister}
            >
              등록
            </button>
          </li>
        </ul>
      </section>
      {/* <SuccessPopup
        isOpen={isOpen}
        onClose={e=>setIsOpen(!isOpen)}
      /> */}
    </main>
  );
}
