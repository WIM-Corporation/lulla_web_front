export default function Test() {
  // useEffect(() => {

  // });

  const handleTest = e=>{
    window.app.showToast("치킨!");
  }

  return (
    <div>
      <h1>dsadsad</h1>
      <button
        onClick={handleTest}
      >test</button>
    </div>
  );
}