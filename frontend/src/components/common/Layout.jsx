import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="portal">
      <Navbar />
      <div className="main">{children}</div>
    </div>
  );
};

export default Layout;