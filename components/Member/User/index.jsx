import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import Contents from "./Contents";

export default (props) => {
  return (
    <div className="Wrap side_layout">
      <AccountNav />
      <div className="container">
        <NavHeader />
        <Contents />
      </div>
    </div>
  );
};
