import { useState } from "react";
import { Link } from "react-router-dom";
import { students } from "../data/data";
import { Status } from "./Dashboard";

export default function Students() {

  const [search, setSearch] = useState("");

  const filtered = students.filter((student) =>
    `${student.name} ${student.id} ${student.academy} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>

      <div className="page-heading">

        <div>
          <h2>Students</h2>
          <p>Manage all registered students.</p>
        </div>

        <button className="primary-btn">
          + Add Student
        </button>

      </div>

      <div className="panel">

        <div className="filter-row">

          <input
            className="input"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="input">
            <option>All Students</option>
            <option>Accepted</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Academy</th>
                <th>Course</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((student) => (
                <tr key={student.id}>

                  <td>
                    <strong>{student.name}</strong>
                  </td>

                  <td>{student.id}</td>

                  <td>{student.academy}</td>

                  <td>{student.course}</td>

                  <td>{student.date}</td>

                  <td>
                    <Status status={student.status} />
                  </td>

                  <td>
                    <Link
                      className="small-link"
                      to={`/students/${student.id}`}
                    >
                      View
                    </Link>
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