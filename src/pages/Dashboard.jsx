import { academies, students } from "../data/data";

export default function Dashboard() {

  const totalStudents = academies.reduce(
    (sum, academy) => sum + academy.students,
    0
  );

  const accepted = academies.reduce(
    (sum, academy) => sum + academy.accepted,
    0
  );

  const pending = academies.reduce(
    (sum, academy) => sum + academy.pending,
    0
  );

  const rejected = academies.reduce(
    (sum, academy) => sum + academy.rejected,
    0
  );

  const totalApplications = accepted + pending + rejected;

  const rate = Math.round(
    (accepted / totalApplications) * 100
  );

  return (
    <>

      <section className="welcome">

        <div>
          <h2>Dashboard Overview</h2>

          <p>
            Monitor academies, students and ATP applications.
          </p>
        </div>

        <button className="download-btn">
          ↓ Download PDF
        </button>

      </section>

      <section className="stats-grid">

        <Stat
          icon="🏫"
          label="Total Academies"
          value={academies.length}
          color="green"
        />

        <Stat
          icon="👨‍🎓"
          label="Total Students"
          value={totalStudents}
          color="blue"
        />

        <Stat
          icon="✓"
          label="ATP Accepted"
          value={accepted}
          color="success"
        />

        <Stat
          icon="⏳"
          label="ATP Pending"
          value={pending}
          color="orange"
        />

      </section>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>ATP Application Performance</h3>
              <p>Current application overview</p>
            </div>

            <select>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>

          <div className="simple-chart">

            {[40, 55, 48, 65, 60, 72, 68, 84, 75, 90, 87, 95].map(
              (height, index) => (
                <div className="chart-bar-wrap" key={index}>

                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />

                  <span>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][index]}
                  </span>

                </div>
              )
            )}

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Acceptance Rate</h3>
              <p>Overall ATP status</p>
            </div>
          </div>

          <div className="big-rate">
            {rate}%
          </div>

          <div className="rate-label">
            Application acceptance rate
          </div>

          <div className="progress">
            <div style={{ width: `${rate}%` }} />
          </div>

          <div className="rate-stats">

            <div>
              <strong>{accepted}</strong>
              <span>Accepted</span>
            </div>

            <div>
              <strong>{pending}</strong>
              <span>Pending</span>
            </div>

            <div>
              <strong>{rejected}</strong>
              <span>Rejected</span>
            </div>

          </div>

        </div>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>
            <h3>Academy Performance</h3>
            <p>Academy-wise student statistics</p>
          </div>

          <button className="view-btn">
            View All →
          </button>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Academy</th>
                <th>Location</th>
                <th>Students</th>
                <th>Accepted</th>
                <th>Pending</th>
                <th>Rejected</th>
              </tr>
            </thead>

            <tbody>

              {academies.map((academy) => (
                <tr key={academy.id}>

                  <td>
                    <strong>{academy.name}</strong>
                  </td>

                  <td>{academy.location}</td>

                  <td>{academy.students}</td>

                  <td>
                    <span className="green-number">
                      {academy.accepted}
                    </span>
                  </td>

                  <td>
                    <span className="orange-number">
                      {academy.pending}
                    </span>
                  </td>

                  <td>
                    <span className="red-number">
                      {academy.rejected}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      <div className="panel students-panel">

        <div className="panel-header">

          <div>
            <h3>Recent Students</h3>
            <p>Latest registered students</p>
          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Academy</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {students.slice(0, 5).map((student) => (
                <tr key={student.id}>

                  <td>
                    <strong>{student.name}</strong>
                  </td>

                  <td>{student.id}</td>

                  <td>{student.academy}</td>

                  <td>{student.course}</td>

                  <td>
                    <Status status={student.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className="stat-card">

      <div className="stat-icon-row">

        <div className={`stat-icon ${color}`}>
          {icon}
        </div>

      </div>

      <p>{label}</p>

      <h3>{value.toLocaleString()}</h3>

      <span className="stat-footer">
        Updated just now
      </span>

    </div>
  );
}

export function Status({ status }) {
  return (
    <span className={`student-status ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}