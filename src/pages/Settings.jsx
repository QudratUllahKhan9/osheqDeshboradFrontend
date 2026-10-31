export default function Settings() {
  return (
    <>

      <div className="page-heading">

        <div>
          <h2>Settings</h2>
          <p>Manage your dashboard settings.</p>
        </div>

      </div>

      <div className="settings-grid">

        <div className="panel">

          <h3>Administrator Profile</h3>

          <div className="form-group">
            <label>Name</label>
            <input
              className="input full"
              defaultValue="Qudrat Khan"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="input full"
              defaultValue="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              className="input full"
              defaultValue="0300-0000000"
            />
          </div>

          <button className="primary-btn">
            Save Changes
          </button>

        </div>

        <div className="panel">

          <h3>System Settings</h3>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Receive application notifications.</p>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-row">
            <div>
              <strong>ATP Notifications</strong>
              <p>Notify when an ATP is accepted.</p>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-row">
            <div>
              <strong>Automatic Reports</strong>
              <p>Generate monthly reports.</p>
            </div>

            <input type="checkbox" />
          </div>

        </div>

      </div>

    </>
  );
}