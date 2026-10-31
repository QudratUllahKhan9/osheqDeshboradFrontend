import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/", icon: "▦" },
    { name: "Academies", path: "/academies", icon: "⌂" },
    { name: "Students", path: "/students", icon: "♙" },
    { name: "ATP Applications", path: "/applications", icon: "✓" },
    { name: "Reports", path: "/reports", icon: "▤" },
    { name: "Certificates", path: "/certificates", icon: "▣", badge: "NEW" },
  ];

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-logo">A</div>

        <div>
          <h2>AcademyPro</h2>
          <span>Management System</span>
        </div>
      </div>

      <div className="menu-title">MAIN MENU</div>

      <nav>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
            {item.badge && <span className="menu-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <span className="menu-icon">⚙</span>
          <span>Settings</span>
        </NavLink>

        <button className="menu-item">
          <span className="menu-icon">?</span>
          <span>Help Center</span>
        </button>

        <div className="admin-box">
          <div className="avatar">QK</div>

          <div className="admin-info">
            <strong>Qudrat Khan</strong>
            <span>Administrator</span>
          </div>

          <button className="dots">⋮</button>
        </div>

      </div>

    </aside>
  );
}
