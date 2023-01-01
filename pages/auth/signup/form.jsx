import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

import Header from "@/components/common/Header";
import TextField from "@/components/Auth/TextField";
import useInput from "@/lib/hooks/useInput";
import useLoading from "@/lib/hooks/useLoading";
import { useEffect } from "react";
import PopUp, {
  PopUpPolicyBody,
  PopUpPolicyBodyItem,
  PopUpBasicBody,
} from "@/components/common/PopUp";
import useStores from "@/stores/useStores"; // context provider 스타일 (추천)
import { observer } from "mobx-react-lite";

const FormComponent = observer(() => {
  const router = useRouter();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const { authStore, joinStore } = useStores();
  const [popUpOpen, setPopUpOpen] = useState(false);

  // Popup 관련 State
  const initialPopUp = {
    open: false,
    layout: popUpLayout("termView1"),
    name: "termView1",
  };
  const [popUp, setPopUp] = useState(initialPopUp);

  // Input Checkbox 관련 State
  const initialCheckInputs = {
    termView1: false,
    termView2: false,
    termView3: false,
  };
  const [checkInputs, setCheckInputs] = useState(initialCheckInputs);
  const { termView1, termView2, termView3 } = checkInputs;

  // Input Text(TextFiled) 관련 State
  const initialInputsError = {
    email: false,
    password: false,
    passwordCheck: false,
  };
  const initialInputsText = { email: "", password: "", passwordCheck: "" };
  const initialInputs = { email: "", password: "", passwordCheck: "" };
  const { handleStatus, loading, error, handleError, message, handleMessage } =
    useLoading("initial", {
      initialError: initialInputsError,
      initialMsg: initialInputsText,
    });
  const { inputs, handleChange } = useInput(initialInputs, {
    cb: ({ name }) => {
      handleMessage({ ...message, [name]: "" });
      handleStatus("initial");
      if (name === "email") source.cancel("요청 취소: 이메일 값 변경");
    },
  });
  const { email, password, passwordCheck } = inputs;

  // Event Handler
  const handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPopUp({
      name: e.target.name,
      layout: popUpLayout(e.target.name),
      open: true,
    });
  };

  const handleClose = () => {
    setPopUp({ ...popUp, open: false });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        // 이메일 형식이 맞지 않거나, 기존 DB에 존재하는지 확인한다.
        if (!value.match(emailRegExp)) {
          handleStatus("error");
          handleError({ [name]: true });
          handleMessage({
            ...message,
            [name]: "올바르지 않은 이메일 주소입니다.",
          });
          return;
        }
        axios
          .post(
            "/api/v1/auth/check-email",
            { [name]: value },
            { cancelToken: source.token }
          )
          .then(({ data }) => {
            if (data.resultCode > 0) {
              handleStatus("success");
              handleError({ [name]: false });
            } else {
              handleStatus("error");
              handleError({ [name]: true });
            }
            handleMessage({ ...message, [name]: data.message });
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("작업이 취소되었습니다.");
            } else {
              console.log("통신 오류가 발생했습니다.");
              console.warn(err.data);
            }
          });
        break;
      case "password":
        if (!value.match(passwordRegExp)) {
          handleStatus("error");
          handleError({ [name]: true, passwordCheck: passwordCheck !== value });
          handleMessage({
            ...message,
            [name]: "비밀번호는 8-20자의 영문, 숫자 조합으로 설정해 주세요.",
            passwordCheck:
              passwordCheck === value
                ? "비밀번호가 일치합니다."
                : passwordCheck
                ? "비밀번호가 일치하지 않습니다."
                : "",
          });
        } else {
          handleStatus("success");
          handleError({
            [name]: false,
            passwordCheck: passwordCheck !== value,
          });
          handleMessage({
            ...message,
            [name]: "사용 가능한 비밀번호입니다.",
            passwordCheck:
              passwordCheck === value
                ? "비밀번호가 일치합니다."
                : passwordCheck
                ? "비밀번호가 일치하지 않습니다."
                : "",
          });
        }
        break;
      case "passwordCheck":
        if (value !== password) {
          handleStatus("error");
          handleError({ [name]: true });
          handleMessage({
            ...message,
            passwordCheck: "비밀번호가 일치하지 않습니다.",
          });
        } else {
          handleStatus("success");
          handleError({ [name]: false });
          handleMessage({
            ...message,
            passwordCheck: "비밀번호가 일치합니다.",
          });
        }
        break;
      default:
        break;
    }
  };

  const handleChecked = (e) => {
    const { name, htmlFor } = e.target;
    setCheckInputs({
      ...checkInputs,
      [name || htmlFor]: !checkInputs[name || htmlFor],
    });
    if (name === "allChk" || htmlFor === "allChk")
      if (Object.values(checkInputs).some((v) => v === false))
        setCheckInputs({
          termView1: true,
          termView2: true,
          termView3: true,
        });
      else
        setCheckInputs({
          termView1: false,
          termView2: false,
          termView3: false,
        });
  };

  const handleSubmit = (e) => {
    // /api/v1/auth/join-local 에 연동
    axios({
      method: "post",
      url: "/api/v1/auth/join-local",
      data: {
        name: joinStore.joinName,
        phone: joinStore.joinPhone.replace(/-/g, ""),
        email,
        password,
        advertise: termView3 || false, // 광고성 푸시 동의
      },
    })
      .then(({ data: respData }) => {
        // console.log(respData);
        if (respData.resultCode == 1) {
          afterSignupSuccess(); // 로그인
        } else {
          // failure의 경우의 action이 설계서에 없음
          console.warn(respData);
          alert(respData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("통신중 문제가 발생하였습니다. 관리자에게 문의바랍니다.");
      });
  };

  function afterSignupSuccess() {
    axios({
      method: "post",
      url: "/api/v1/auth/signin",
      data: {
        email,
        password,
      },
    })
      .then(({ data: respData }) => {
        // console.log(respData);
        if (respData.resultCode == 1) {
          // TODO 로그인 정보 스토어에 등록하고
          authStore.signIn(respData.data.authToken);
          router.push("/auth/signup/completed"); // 성공페이지 이동
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

  useEffect(() => {
    if (joinStore?.joinName === "" || joinStore?.joinPhone === "")
      router.push("/auth/signup/verification");

    setCheckInputs(initialCheckInputs);
    setPopUp(initialPopUp);

    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
        // router.push("/auth/signup/warning");
        setPopUpOpen(true);
        return;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [joinStore, router]);

  return (
    <div className="Wrap">
      <Header />
      <PopUp
        open={popUpOpen}
        okBtn={"확인"}
        onOkBtnClick={() => {
          setPopUpOpen(false);
          joinStore.initInfo();
          router.push("/auth/signup/verification");
        }}
        cancelBtn={"취소"}
        onCancelBtnClick={() => {
          router.replace("/auth/signup/form");
          setPopUpOpen(false);
        }}
      >
        <PopUpBasicBody>
          {
            <>
              이전 화면으로 이동할 경우
              <br />
              본인인증이 재진행됩니다.
            </>
          }
        </PopUpBasicBody>
      </PopUp>
      <PopUp
        title={popUp.layout?.title}
        showCloseButton
        open={popUp.open}
        handleClose={handleClose}
        okBtn="동의하기"
        onOkBtnClick={() => {
          setCheckInputs({ ...checkInputs, [popUp.name]: true });
          handleClose();
        }}
      >
        <PopUpPolicyBody>
          {popUp.layout?.body?.map((v, i) => (
            <PopUpPolicyBodyItem key={i} {...v} />
          ))}
        </PopUpPolicyBody>
      </PopUp>
      <main className="flexCenter">
        <div className="title_box">
          <p className="title">회원가입</p>
        </div>
        <section className="sec_1">
          <div className="info_box">
            <p className="sub_title">정보 입력</p>
            <div className="progress">
              <div className="progress_bar on" style={{ width: "80%" }}></div>
            </div>
          </div>

          <ul className="info_form">
            <TextField
              type="email"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={error?.email}
              helperText={message?.email}
            />
            <TextField
              type="password"
              name="password"
              placeholder="비밀번호 (8~20자의 영문, 숫자 조합)"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={error?.password}
              helperText={message?.password}
            />
            <TextField
              type="password"
              name="passwordCheck"
              placeholder="비밀번호 확인"
              value={passwordCheck}
              onChange={handleChange}
              onBlur={handleBlur}
              error={error?.passwordCheck}
              helperText={message?.passwordCheck}
            />
            <li className="info_list">
              <p className="sub_title register_list">약관 동의</p>
              <div className="register_box">
                <div className="register_allchk round_chk">
                  <input
                    type="checkbox"
                    name="allChk"
                    id="allChk"
                    className="all_chk"
                    checked={termView1 && termView2 && termView3}
                    onChange={handleChecked}
                  />
                  <label
                    htmlFor="allChk"
                    className="all_text"
                    onClick={handleChecked}
                  >
                    전체 동의
                  </label>
                </div>
                <ul className="chk_list">
                  <li className="chk_cont">
                    <div className="round_chk">
                      <input
                        type="checkbox"
                        name="termView1"
                        id="termView1"
                        className="term_chk"
                        checked={termView1}
                        onChange={handleChecked}
                      />
                      <label htmlFor="termView1" onClick={handleChecked}>
                        <a
                          href="javascript:void(0);"
                          name="termView1"
                          className="term_link"
                          onClick={handleOpen}
                        >
                          이용약관 동의
                        </a>
                        <span className="term_sub">(필수)</span>
                      </label>
                    </div>
                  </li>
                  <li className="chk_cont">
                    <div className="round_chk">
                      <input
                        type="checkbox"
                        name="termView2"
                        id="termView2"
                        className="term_chk"
                        checked={termView2}
                        onChange={handleChecked}
                      />
                      <label htmlFor="termView2" onClick={handleChecked}>
                        <a
                          href=""
                          name="termView2"
                          className="term_link"
                          onClick={handleOpen}
                        >
                          개인정보 수집 및 이용 동의
                        </a>
                        <span className="term_sub">(필수)</span>
                      </label>
                    </div>
                  </li>
                  <li className="chk_cont">
                    <div className="round_chk">
                      <input
                        type="checkbox"
                        name="termView3"
                        id="termView3"
                        className="term_chk"
                        checked={termView3}
                        onChange={handleChecked}
                      />
                      <label htmlFor="termView3" onClick={handleChecked}>
                        <a
                          href="javascript:void(0);"
                          name="termView3"
                          className="term_link"
                          onClick={handleOpen}
                        >
                          이벤트 및 광고성 정보 수집
                        </a>
                        <span className="term_sub">(선택)</span>
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="info_list">
              <button
                type="button"
                name="register_ok"
                className="info_btn"
                disabled={
                  Object.values(inputs).some((v) => v === "") ||
                  !(checkInputs.termView1 && checkInputs.termView2) ||
                  Object.values(error).some((v) => v)
                }
                onClick={handleSubmit}
              >
                확인
              </button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
});

const Form = (props) => <FormComponent {...props} />;
export default Form;

//RegExp
const emailRegExp =
  /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/gi;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/gi;
const popUpLayout = (key) => {
  const layout = {
    termView1: {
      title: "이용약관 동의",
      body: [
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
      ],
    },
    termView2: {
      title: "개인정보 수집 및 이용 동의",
      body: [
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
      ],
    },
    termView3: {
      title: "이벤트 및 광고성 정보 수집",
      body: [
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
        {
          title: "1. 조건 안내",
          desc: `때에, 열매를 귀는 찾아 피어나는 많이 얼마나 이것이다. 남는 위하여, 현저하게 청춘을 너의 아니다. 부패를 그림자는 그들을 가지에 황금시대다. 수 황금시대를 밝은 것이다. 이것은 이 타오르고 있을 구하기 있다. 역사를 불어 든 봄바람이다. 온갖 심장의 피가 밝은 이것이다. 이상의 그들을 천하를 생생하며, 든 꽃이 끓는 것이다. 불러 품고 새 따뜻한 황금시대의 과실이 열락의 아름다우냐? 청춘 있는 속에 끓는다. 그들은 있으며, 이는 힘있다. 오직 시들어 곳으로 대고, 주는 같으며, 우리 이것이다. 꽃이 동력은 같이 희망의 시들어 심장은 몸이 찬미를 듣는다. 이상 목숨이 속에 우리의 찾아다녀도, 위하여 위하여 무엇을 듣는다. 새가 시들어 싹이 실현에 생생하며, 황금시대를 트고, 새 황금시대다. 인생의 듣기만 구할 황금시대다. 있음으로써 그들의 이것은 대한 얼마나 있으랴? 주며, 풀이 쓸쓸한 있는 있으랴? 낙원을 길을 굳세게 오아이스도 이성은 이것이다. 지혜는 열락의 고동을 운다. 생의 보는 것은 우는 그들의 것이다.
                소담스러운 못할 가장 것이다. 발휘하기 트고, 노래하며 우리 가치를 천지는 칼이다. 있는 충분히 그들의 그들은 낙원을 갑 열매를 봄바람이다. 가슴이 이상 설산에서 만천하의 얼마나 있는가? 따뜻한 힘차게 인류의 있는 것이다. 무엇이 같지 수 이것을 날카로우나 이상, 봄바람이다. 찬미를 청춘을 가슴에 군영과 것이다. 능히 것은 하는 우리 두기 없으면 이상은 있음으로써 주는 있으랴? 때까지 앞이 있는 광야에서 수 아니더면, 때문이다.
                황금시대의 현저하게 인류의 장식하는 우는 사막이다. 심장의 기관과 현저하게 가지에 인간에 보배를 피에 것이다. 열매를 이상의 인간에 그들은 창공에 되려니와, 굳세게 아니다. 사랑의 곳이 있는 품었기 칼이다. 타오르고 봄날의 소리다.이것은 끝에 이 그들을 이상의 인생의 붙잡아 사막이다. 산야에 얼음 그것을 위하여 것이다. 산야에 길을 듣기만 속에 이상은 뜨고, 아니한 사막이다. 천지는 위하여서 속잎나고, 얼마나 보내는 인간이 천고에 쓸쓸하랴? 실현에 봄날의 길지 영원히 약동하다.`,
        },
      ],
    },
  };

  return layout?.[key] ?? {};
};
