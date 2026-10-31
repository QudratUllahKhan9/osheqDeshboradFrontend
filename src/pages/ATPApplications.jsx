import { useState } from "react";
import { applications } from "../data/data";

export default function ATPApplications() {

  const [data, setData] = useState(applications);

  const [filter, setFilter] = useState("All");

  const updateStatus = (id, status) => {

    setData((current) =>
      current.map((application) =>
        application.applicationId === id
          ? { ...application, status }
          : application
      )
    );

  };

  const filtered =
    filter === "All"
      ? data
      : data.filter(
          (application) => application.status === filter
        );

  return (
    <>

      <div className="page-heading">

        <div>
          <h2>ATP Applications</h2>

          <p>
            Review and manage student ATP applications.
          </p>
        </div>

      </div>

      <div className="application-stats">

        <div>
          <span>Total</span>
          <strong>{data.length}</strong>
        </div>

        <div>
          <span>Accepted</span>
          <strong className="green-number">
            {data.filter(
              (x) => x.status === "Accepted"
            ).length}
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong className="orange-number">
            {data.filter(
              (x) => x.status === "Pending"
            ).length}
          </strong>
        </div>

        <div>
          <span>Rejected</span>
          <strong className="red-number">
            {data.filter(
              (x) => x.status === "Rejected"
            ).length}
          </strong>
        </div>

      </div>

      <div className="panel">

        <div className="filter-row">

          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Application</th>
                <th>Student</th>
                <th>Academy</th>
                <th>Course</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((application) => (
                <tr key={application.applicationId}>

                  <td>
                    <strong>
                      {application.applicationId}
                    </strong>
                  </td>

                  <td>{application.name}</td>

                  <td>{application.academy}</td>

                  <td>{application.course}</td>

                  <td>{application.submitted}</td>

                  <td>
                    <span
                      className={`student-status ${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>
                  </td>

                  <td>

                    {application.status === "Pending" ? (
                      <div className="action-buttons">

                        <button
                          className="accept-btn"
                          onClick={() =>
                            updateStatus(
                              application.applicationId,
                              "Accepted"
                            )
                          }
                        >
                          ✓ Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateStatus(
                              application.applicationId,
                              "Rejected"
                            )
                          }
                        >
                          ✕ Reject
                        </button>

                      </div>
                    ) : (
                      <span className="completed">
                        Completed
                      </span>
                    )}

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