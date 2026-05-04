import logo from "../../assets/company-logo.png"; // 1. Import your logo file

const Navbar = () => {
  return (
    <div className="topbar">
      <div className="brand">
        {/* 2. Replace text with the img tag */}
        <img src={logo} alt="Company Logo" className="logo-img" />
      </div>
      <div className="topbar-right">
        <div className="badge">Recruitment Drive</div>
      </div>
    </div>
  );
};

export default Navbar;