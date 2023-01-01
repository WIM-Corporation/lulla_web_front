import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import SchoolCreateForm from "./SchoolCreateForm";

export default (props) => {
  return (
    <>
      <div className="Wrap side_layout">
        <div className="container full">
          <NavHeader hasLogo />
          <SchoolCreateForm />
        </div>
      </div>
    </>
  );
};
