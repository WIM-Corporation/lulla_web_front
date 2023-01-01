import DefaultNav from "@/components/Layouts/DefaultNav";
import NavHeader from "@/components/Layouts/NavHeader";
import NoticeFeed from "./NoticeFeed";

export default function Notice(props) {
  return (
    <div className="Wrap side_layout">
      <DefaultNav />
      <div className="container">
        <NavHeader />
        <NoticeFeed />
      </div>
    </div>
  );
}
