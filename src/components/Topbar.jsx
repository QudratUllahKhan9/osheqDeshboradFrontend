import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  const titles = {
    "/": "Dashboard",
    "/academies": "Academies",
    "/students": "Students",
    "/applications": "ATP Applications",
    "/reports": "Reports",
    "/certificates": "Certificates",
    "/settings": "Settings",
  };

  const title = titles[location.pathname] || "Dashboard";

  return (
    <header className="topbar">

      <div>
        <h1>{title}</h1>
        <p>Welcome back, Qudrat 👋</p>
      </div>

      <div className="top-actions">

        <div className="search-box">
          <span>⌕</span>
          <input placeholder="Search..." />
        </div>

        <button className="notification">
          🔔
          <span />
        </button>

        <div className="profile">
          <div className="avatar">QK</div>

          <div>
            <strong>Qudrat Khan</strong>
            <small>Administrator</small>
          </div>
        </div>

      </div>

    </header>
  );
}
