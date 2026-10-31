import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="dashboard">

      <Sidebar />

      <main className="main">

        <Topbar />

        <div className="content">
          <Outlet />
        </div>

        <footer>
          © 2026 AcademyPro. All rights reserved.
        </footer>

      </main>

    </div>
  );
}