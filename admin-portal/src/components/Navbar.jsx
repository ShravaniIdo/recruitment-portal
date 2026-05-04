export default function Navbar() {
  return (
    <div className="navbar">

      <div>
        <h2>Recruitment Admin Portal</h2>
        <p>Welcome back, HR Team</p>
      </div>

      <div className="profile">
        <img
          src="https://i.pravatar.cc/45"
          alt="profile"
        />

        <div>
          <strong>Admin</strong>
          <p>HR Manager</p>
        </div>
      </div>

    </div>
  );
}