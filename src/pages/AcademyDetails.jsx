import { Link, useParams } from "react-router-dom";
import { academies, students } from "../data/data";
import { Status } from "./Dashboard";

export default function AcademyDetails() {

  const { id } = useParams();

  const academy = academies.find(
    (item) => item.id === Number(id)
  );

  if (!academy) {
    return <h2>Academy not found</h2>;
  }

  const academyStudents = students.filter(
    (student) => student.academy === academy.name
  );

  return (
    <>

      <Link to="/academies" className="back-link">
        ← Back to Academies
      </Link>

      <div className="details-header">

        <div className="details-icon">
          {academy.name.charAt(0)}
        </div>

        <div>
          <h2>{academy.name}</h2>
          <p>
            {academy.location} · {academy.phone}
          </p>
        </div>

        <span className="active-badge">
          Active
        </span>

      </div>

      <div className="stats-grid">

        <StatSmall
          title="Students"
          value={academy.students}
        />

        <StatSmall
          title="Accepted"
          value={academy.accepted}
        />

        <StatSmall
          title="Pending"
          value={academy.pending}
        />

        <StatSmall
          title="Rejected"
          value={academy.rejected}
        />

      </div>

      <div className="panel">

        <div className="panel-header">
          <div>
            <h3>Academy Students</h3>
            <p>Students registered under this academy.</p>
          </div>
        </div>

        <table>

          <thead>
            <tr>
              <th>Student</th>
              <th>ID</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {academyStudents.map((student) => (
              <tr key={student.id}>

                <td>{student.name}</td>

                <td>{student.id}</td>

                <td>{student.course}</td>

                <td>
                  <Status status={student.status} />
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </>
  );
}

function StatSmall({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}