import { useState } from "react";
import { Link } from "react-router-dom";
import { academies } from "../data/data";

export default function Academies() {

  const [search, setSearch] = useState("");

  const filtered = academies.filter(
    (academy) =>
      academy.name.toLowerCase().includes(search.toLowerCase()) ||
      academy.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>

      <div className="page-heading">

        <div>
          <h2>Academies</h2>
          <p>Manage all registered academies.</p>
        </div>

        <button className="primary-btn">
          + Add Academy
        </button>

      </div>

      <div className="panel">

        <div className="filter-row">

          <input
            className="input"
            placeholder="Search academy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="input">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Academy</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Students</th>
                <th>Accepted</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((academy) => (
                <tr key={academy.id}>

                  <td>
                    <strong>{academy.name}</strong>
                  </td>

                  <td>{academy.location}</td>

                  <td>{academy.phone}</td>

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
                    <span className="active-badge">
                      Active
                    </span>
                  </td>

                  <td>
                    <Link
                      className="small-link"
                      to={`/academies/${academy.id}`}
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