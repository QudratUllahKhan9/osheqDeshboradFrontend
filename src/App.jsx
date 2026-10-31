import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Academies from "./pages/Academies";
import AcademyDetails from "./pages/AcademyDetails";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import ATPApplications from "./pages/ATPApplications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Certificates from "./pages/Certificates";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/academies" element={<Academies />} />
          <Route path="/academies/:id" element={<AcademyDetails />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/applications" element={<ATPApplications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
