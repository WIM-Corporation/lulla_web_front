export default {
  email:
    /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
  phone: /\d{3}-\d{4}-\d{4}/,
  phoneFormat: /(\d{3})(\d{4})(\d{4})/,
  telephone:
    /^(02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064|070)(\d{3,4})(\d{4})$/g,
};
