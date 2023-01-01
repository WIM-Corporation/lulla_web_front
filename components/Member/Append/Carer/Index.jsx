import AccountNav from "@/components/Layouts/AccountNav";
import NavHeader from "@/components/Layouts/NavHeader";
import CreateCarerForm from "./CreateCarerForm";

export default (props) => {
  return (
    <div className="Wrap side_layout">
      <AccountNav />
      <div className="container full">
        <NavHeader />
        <CreateCarerForm />
      </div>
    </div>
  );
};
