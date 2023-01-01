import DefaultNav from "@/components/Layouts/DefaultNav";
import NavHeader from "@/components/Layouts/NavHeader";
import AlbumFeed from './AlbumFeed';

export default props => {
  return (
    <div className="Wrap side_layout">
      <DefaultNav />
      <div className="container">
        <NavHeader />
        <AlbumFeed />
      </div>
    </div>
  );
}