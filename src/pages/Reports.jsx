import { academies, students } from "../data/data";

export default function Reports() {

  const accepted = students.filter(
    (x) => x.status === "Accepted"
  ).length;

  const pending = students.filter(
    (x) => x.status === "Pending"
  ).length;

  const rejected = students.filter(
    (x) => x.status === "Rejected"
  ).length;

  const downloadPDF = () => {
    window.print();
  };

  return (
    <>

      <div className="page-heading">

        <div>
          <h2>Reports</h2>

          <p>
            Generate and download academy reports.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={downloadPDF}
        >
          ↓ Download PDF
        </button>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <p>Total Academies</p>
          <h3>{academies.length}</h3>
        </div>

        <div className="stat-card">
          <p>Total Students</p>
          <h3>{students.length}</h3>
        </div>

        <div className="stat-card">
          <p>Accepted</p>
          <h3 className="green-number">{accepted}</h3>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h3 className="orange-number">{pending}</h3>
        </div>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>
            <h3>Academy Report</h3>
            <p>Complete academy statistics.</p>
          </div>

        </div>

        <table>

          <thead>
            <tr>
              <th>Academy</th>
              <th>Students</th>
              <th>Accepted</th>
              <th>Pending</th>
              <th>Rejected</th>
            </tr>
          </thead>

          <tbody>

            {academies.map((academy) => (
              <tr key={academy.id}>

                <td>{academy.name}</td>

                <td>{academy.students}</td>

                <td className="green-number">
                  {academy.accepted}
                </td>

                <td className="orange-number">
                  {academy.pending}
                </td>

                <td className="red-number">
                  {academy.rejected}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </>
  );
}