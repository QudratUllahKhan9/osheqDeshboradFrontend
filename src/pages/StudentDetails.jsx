import { Link, useParams } from "react-router-dom";
import { students } from "../data/data";
import { Status } from "./Dashboard";

export default function StudentDetails() {

  const { id } = useParams();

  const student = students.find(
    (item) => item.id === id
  );

  if (!student) {
    return <h2>Student not found</h2>;
  }

  return (
    <>

      <Link to="/students" className="back-link">
        ← Back to Students
      </Link>

      <div className="student-detail-card">

        <div className="large-avatar">
          {student.name
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="student-detail-main">

          <h2>{student.name}</h2>

          <p>{student.id}</p>

          <Status status={student.status} />

        </div>

      </div>

      <div className="details-grid">

        <Info label="Father Name" value={student.father} />

        <Info label="Phone" value={student.phone} />

        <Info label="Academy" value={student.academy} />

        <Info label="Course" value={student.course} />

        <Info label="Application Date" value={student.date} />

        <Info label="ATP Status" value={student.status} />

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>
            <h3>Student Documents</h3>
            <p>Documents submitted with application.</p>
          </div>

        </div>

        <div className="documents">

          <div className="document-card">
            <span>📄</span>
            <strong>CNIC / ID Document</strong>
            <small>Submitted</small>
          </div>

          <div className="document-card">
            <span>📄</span>
            <strong>Educational Certificate</strong>
            <small>Submitted</small>
          </div>

          <div className="document-card">
            <span>📄</span>
            <strong>Application PDF</strong>
            <small>Available</small>
          </div>

        </div>

      </div>

    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}