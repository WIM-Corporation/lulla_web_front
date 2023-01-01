import useStores from "@/stores/useStores";
import axios from "axios";
import { useState } from "react";
import SelectSido from "./SelectSido";
import SelectSiGunGu from "./SelectSiGunGu";
import SuccessPopup from "./SuccessPopup";
import classnames from "classnames";
import regex from "@/assets/regex";

export default function SchoolCreateForm() {
  const { authStore } = useStores();

  const [tab, setTab] = useState(0); // 0:검색 입력, 1: 직접 입력
  const [inSchoolName, setInSchoolName] = useState("");
  const [searchedSchoolList, setSearchedSchoolList] = useState([]);

  const [inSiDo, setInSiDo] = useState("");
  const [inSiGunGu, setInSiGunGu] = useState("");
  const [inAddress, setInAddress] = useState("");
  const [inOwnerName, setInOwnerName] = useState("");
  const [inTel, setInTel] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleChangeTab = (tabId) => {
    setTab(tabId);
    setInSchoolName("");
    setInSiDo("");
    setInSiGunGu("");
    setInAddress("");
    setInOwnerName("");
    setInTel("");
  };
  const handleSearchSchool = (e) => {
    // API 통신
    axios({
      method: "post",
      url: "/api/v1/address/institution/list",
      data: { name: inSchoolName },
    })
      .then(({ data: respData }) => {
        //console.log(respData);
        if (respData.resultCode == 1) {
          // 성공한 경우
          setSearchedSchoolList(respData.data);
          // } else if( respData.resultCode == -310 ) { // 가입되지 않은 사용자
          // } else if( respData.resultCode == -100 ) { // SMS인증 안함 == 정상 플로우에는 나오지 않음
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
    const schoolId = e.target.value;
    if (schoolId != 0) {
      const result = searchedSchoolList.find((item) => item.id == schoolId);
      setInSiDo(result.district_one_id);
      setInSiGunGu(result.district_two_id);
      setInAddress(result.address);
      setInOwnerName(result.admin);
      setInTel(result.tel);
      setInSchoolName(result.name);
    }
  };

  const handleClickRegister = (e) => {
    if (inTel.length < 1) {
      alert("전화번호를 입력하세요");
      return;
    }
    if (inAddress.length < 1) {
      alert("주소를 입력하세요");
      return;
    }
    if (inSchoolName.length < 1) {
      alert("기관이름을 입력하세요");
      return;
    }
    if (inSiDo.length < 1) {
      alert("시/도를 선택하세요");
      return;
    }
    if (inSiGunGu.length < 1) {
      alert("시군구를 선택하세요");
      return;
    }
    if (inOwnerName.length < 1) {
      alert("원장님 이름을입력하세요");
      return;
    }
    /* 통신 시작 */
    axios({
      method: "post",
      url: "/api/v1/school/create",
      headers: { Authorization: "Bearer " + authStore.authToken },
      data: {
        tel: inTel,
        address: inAddress,
        name: inSchoolName,
        district_one_id: inSiDo,
        district_two_id: inSiGunGu,
        admin_name: inOwnerName,
        description: "웹에서 생성한 테스트 기관",
      },
    })
      .then(({ data: respData }) => {
        console.log(respData);
        if (respData.resultCode == 1) {
          // 성공한 경우
          // TODO 성공 팝업
          setIsOpen(true);
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
    <>
      <main className="flexCenter">
        <div className="title_box">
          <p className="title">원 등록</p>
        </div>
        <section className="sec_1">
          <div className="tab_box">
            <div
              className={classnames({ tab_btn: true, active: tab === 0 })}
              onClick={() => handleChangeTab(0)}
            >
              검색 입력
            </div>
            <div
              className={classnames({ tab_btn: true, active: tab === 1 })}
              onClick={() => handleChangeTab(1)}
            >
              직접 입력
            </div>
          </div>
          <ul className="info_form">
            {tab === 0 && (
              <li className="info_list">
                <div className="flex_box won_box on">
                  <input
                    placeholder="원 검색"
                    className="info_input won_search on"
                    type="search"
                    defaultValue={inSchoolName}
                    onChange={(e) => setInSchoolName(e.target.value)}
                  />
                  {/* <input type="search" className="info_input won_search on" value="랄라 유치원" /> */}
                  <button
                    type="button"
                    className="won_search_btn on"
                    onClick={handleSearchSchool}
                  >
                    <img src="/imgs/search-s.png" />
                  </button>
                </div>
              </li>
            )}
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
              <div className="flex_box country_box">
                <SelectSido
                  selectedSido={inSiDo}
                  onSelect={(sido) => setInSiDo(sido)}
                />
                <SelectSiGunGu
                  selectedSido={inSiDo}
                  selectedSigungu={inSiGunGu}
                  onSelect={(sigungu) => setInSiGunGu(sigungu)}
                />
              </div>
            </li>
            <input type="hidden" readOnly defaultValue={inSiDo} />
            <input type="hidden" readOnly defaultValue={inSiGunGu} />
            <li className="info_list">
              <input
                placeholder="상세주소"
                className="info_input"
                type="text"
                defaultValue={inAddress}
                onChange={(e) => setInAddress(e.target.value)}
              />
            </li>
            {tab === 1 && (
              <li className="info_list">
                <input
                  placeholder="원 이름"
                  className="info_input"
                  type="text"
                  defaultValue={inSchoolName}
                  onChange={(e) => setInSchoolName(e.target.value)}
                />
              </li>
            )}
            <li className="info_list">
              <input
                placeholder="원장님 이름"
                className="info_input"
                type="text"
                defaultValue={inOwnerName}
                onChange={(e) => setInOwnerName(e.target.value)}
              />
            </li>
            <li className="info_list">
              <input
                placeholder="원 전화번호"
                className="info_input"
                type="text"
                value={inTel}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .replace(
                      /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
                      "$1-$2-$3"
                    )
                    .replace("--", "-");
                  const [first, second, third] = value.split("-");
                  if (
                    value.length > 13 ||
                    (value.length >= 12 &&
                      ((first.length === 2 && (second + third).length > 8) ||
                        (first.length === 3 && (second + third).length > 8)))
                  )
                    return;
                  setInTel(value);
                }}
              />
            </li>
            <li className="info_list">
              <button
                type="button"
                className="info_btn registration_btn"
                onClick={handleClickRegister}
                disabled={
                  !(
                    inSchoolName &&
                    inSiDo &&
                    inSiGunGu &&
                    inOwnerName &&
                    inTel &&
                    inAddress
                  )
                }
              >
                등록
              </button>
            </li>
          </ul>
        </section>

        <SuccessPopup isOpen={isOpen} onClose={(e) => setIsOpen(!isOpen)} />
      </main>
      <style jsx>{`
        main {
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;
        }
        .tab_btn {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
