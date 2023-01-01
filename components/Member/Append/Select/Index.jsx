import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import SelectGrade from "./SelectGrade";

export default (props) => {
  return (
    <>
      <div className="Wrap side_layout">
        {/* <AccountNav /> */}
        <div className="container">
          <NavHeader hasLogo />
          <SelectGrade />
        </div>
      </div>
      <style jsx>{`
        .container {
          margin: 0;
        }
      `}</style>
    </>
  );
};
