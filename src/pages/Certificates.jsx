import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import bgUrl from "../assets/bg_clean2.jpg";
import { API_BASE, LIVE_API, apiFetch, apiUrl } from "../api";
import "../certificates.css";
import "../certificates-extra.css";

const COMPANY = "Safety Solution Pvt Ltd.";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatDate(iso) {
  if (!iso) return "00-Apr-0000";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "00-Apr-0000";
  return `${String(d).padStart(2, "0")}-${MONTHS[m - 1]}-${y}`;
}
function certIdFromNo(certNo) {
  const safe = String(certNo || "").trim().replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
  if (!safe) return "";
  return safe.length >= 4 ? safe : `cert-${safe}`;
}

export default function Certificates() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [provider, setProvider] = useState(COMPANY);
  const [date, setDate] = useState("");
  const [certNo, setCertNo] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);
  const [dup, setDup] = useState(null);

  const loadStatus = useCallback(async () => {
    try {
      const { data } = await apiFetch("/api/status");
      setStatus(data || { ok: false, warnings: ["Status endpoint khali response de raha hai."] });
    } catch (e) {
      setStatus({ ok: false, warnings: [`Backend se connect nahi hua: ${e.message}`] });
    }
  }, []);

  const loadRecords = useCallback(async () => {
    try {
      const { data } = await apiFetch("/api/certificates");
      if (Array.isArray(data)) setRecords(data);
    } catch {
      /* backend off -> silent */
    }
  }, []);

  useEffect(() => {
    loadStatus();
    loadRecords();
  }, [loadStatus, loadRecords]);

  // QR must encode the PUBLIC API domain, never the dashboard domain.
  // QR ka target BACKEND ka URL hai (frontend ka nahi) — /v/<id> backend ka route hai.
  // status.backendBaseUrl backend khud request host se deta hai.
  const base = (status?.backendBaseUrl || API_BASE || LIVE_API).replace(/\/+$/, "");
  const previewId = certIdFromNo(certNo) || "PREVIEW";
  const previewQr = `${base}/v/${previewId}`;

  async function generate(forceReplace = false) {
    setError("");
    setDup(null);
    if (!name.trim()) {
      setError("Participant ka naam zaroori hai.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const { res, data } = await apiFetch("/api/certificates", {
        method: "POST",
        body: JSON.stringify({ name, course, provider, date, certNo, replace: forceReplace }),
      });

      if (res.status === 409) {
        setDup(data);
        return;
      }
      if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);

      setResult(data);
      setCertNo(data.certNo);
      loadRecords();
    } catch (e) {
      const msg = e.message || "Generation failed";
      // Do NOT blame connectivity for every error — a browser launch failure is
      // a server-side deployment problem, not an unreachable backend.
      if (/Failed to launch|Cannot find module|ENOENT/i.test(msg)) {
        setError(
          `${msg} — backend ka jawab nahi aaya` +
            `redeploy karke dobara koshish karein.`
        );
      } else if (/Failed to fetch|NetworkError|load failed/i.test(msg)) {
        setError(`${msg} — backend se connect nahi hua (${apiUrl("/api/health")})`);
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  const badge = useMemo(() => {
    if (!status) return { text: "Checking Cloudinary…", cls: "warn" };
    if (status.cloudinaryConfigured) return { text: "Cloudinary connected", cls: "ok" };
    return { text: "Cloudinary NOT configured — scan par data nahi aayega", cls: "bad" };
  }, [status]);

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Certificates</h2>
          <p>
            Generate karein → PDF + preview Cloudinary par save → QR scan karne par wahi
            certificate khulta hai.
          </p>
        </div>
        <span className={`cert-badge cert-badge-${badge.cls}`}>{badge.text}</span>
      </div>

      {status && (
        <div className="panel cert-status-panel">
          <div className="cert-status-grid">
            <div>
              <span className="cert-status-label">API</span>
              <code className="cert-status-value">{API_BASE || "localhost proxy :4000"}</code>
            </div>
            <div>
              <span className="cert-status-label">QR base (backend)</span>
              <code className="cert-status-value">{base}</code>
            </div>
            <div>
              <span className="cert-status-label">Frontend (CORS)</span>
              <code className="cert-status-value">{status.frontendBaseUrl || "—"}</code>
            </div>
            <div>
              <span className="cert-status-label">Storage</span>
              <code className="cert-status-value">
                {status.cloudinaryConfigured ? "Cloudinary (permanent)" : "Configured nahi"}
              </code>
            </div>
          </div>

          {Array.isArray(status.warnings) && status.warnings.length > 0 && (
            <div className="cert-warn">
              {status.warnings.map((w, i) => (
                <div key={i}>⚠ {w}</div>
              ))}
            </div>
          )}

          {status.cloudinaryConfigured === false && (
            <div className="cert-warn">
              ⚠ Backend par Cloudinary keys set nahi hain. Vercel → Settings → Environment
              Variables me <b>CLOUDINARY_CLOUD_NAME</b>, <b>CLOUDINARY_API_KEY</b>,{" "}
              <b>CLOUDINARY_API_SECRET</b> add karke <b>Redeploy</b> karein. Uske baad QR scan
              par certificate show hoga.
            </div>
          )}
        </div>
      )}

      <div className="cert-grid">
        <div className="panel">
          <h3>Certificate Details</h3>

          <div className="form-group">
            <label>Participant Name *</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmad Khan"
            />
          </div>

          <div className="form-group">
            <label>Course / Program Name</label>
            <input
              className="input"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Occupational Safety Health Environment & Quality"
            />
          </div>

          <div className="form-group">
            <label>Training Provider</label>
            <input className="input" value={provider} onChange={(e) => setProvider(e.target.value)} />
          </div>

          <div className="filter-row cert-form-row">
            <div className="form-group">
              <label>Date</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <small className="cert-hint">
                Certificate par: <b>{formatDate(date)}</b>
              </small>
            </div>
            <div className="form-group">
              <label>Certificate No</label>
              <input
                className="input"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                placeholder="auto if empty"
              />
              <small className="cert-hint">QR link: /v/{certIdFromNo(certNo) || "auto"}</small>
            </div>
          </div>

          {error && <div className="cert-error">⚠ {error}</div>}

          {dup && (
            <div className="cert-warn" style={{ marginBottom: 12 }}>
              <div style={{ marginBottom: 8 }}>⚠ {dup.error}</div>
              <button className="primary-btn" onClick={() => generate(true)} disabled={busy}>
                Isi number se update karein (overwrite)
              </button>
            </div>
          )}

          <button className="primary-btn cert-generate-btn" onClick={() => generate(false)} disabled={busy}>
            {busy ? "Generating… (PDF → Cloudinary → QR)" : "⚡ Generate Certificate (PDF + QR + Cloudinary)"}
          </button>

          {result && (
            <div className="cert-result">
              <div className="cert-result-head">
                ✅ Certificate ready —{" "}
                {result.savedToCloudinary ? "Cloudinary par save ho gaya" : "Cloudinary save FAILED"}
              </div>
              <div className="cert-result-body">
                <img src={result.qrDataUrl} alt="QR" className="cert-result-qr" />
                <div className="cert-result-info">
                  <strong>{result.certNo}</strong> — {result.name}
                  <div className="cert-hint">QR scan → {result.verifyUrl}</div>
                  {!result.savedToCloudinary && result.uploadError && (
                    <div className="cert-error" style={{ marginTop: 8 }}>
                      Cloudinary upload fail: {result.uploadError}
                    </div>
                  )}
                  <div className="cert-result-links">
                    <a
                      className="download-btn"
                      href={apiUrl(`/api/pdf/${encodeURIComponent(result.id)}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ⬇ Download PDF
                    </a>
                    <a className="download-btn cert-ghost-btn" href={result.verifyUrl} target="_blank" rel="noreferrer">
                      🔍 Verify Page
                    </a>
                    <a
                      className="download-btn cert-ghost-btn"
                      href={apiUrl(`/api/qr/${encodeURIComponent(result.id)}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ▦ QR PNG
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="panel cert-preview-panel">
          <h3>Live Preview</h3>
          <div className="cert-preview-scroll">
            <div className="cert">
              <img className="cert-bg" src={bgUrl} alt="" draggable="false" />
              <div className="cert-ovl cert-name">{name || "\u00A0"}</div>
              <div className="cert-ovl cert-course">{course || "\u00A0"}</div>
              <div className="cert-ovl cert-provider">{provider || "\u00A0"}</div>
              <div className="cert-ovl cert-dated">DATED: {formatDate(date)}</div>
              <div className="cert-ovl cert-no">CERTIFICATE NO: {certNo || "—"}</div>
              <div className="cert-ovl cert-qr">
                <QRCodeCanvas
                  value={previewQr}
                  size={196}
                  level="M"
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            </div>
          </div>
          <p className="cert-hint" style={{ marginTop: 10 }}>
            Yehi QR final PDF me print hota hai. Scan karne par <b>{previewQr}</b> khulega
            (backend ka verify page) — Cloudinary se certificate preview + PDF download.
          </p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h3>Generated Certificates ({records.length})</h3>
          <p>Cloudinary permanent storage — kisi bhi phone se QR scan karke verify karein.</p>
        </div>

        {records.length === 0 && <p className="cert-hint">Abhi tak koi certificate generate nahi hua.</p>}

        {records.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Cert No</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Storage</th>
                  <th>Links</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.certNo}</strong>
                    </td>
                    <td>{r.name}</td>
                    <td>{r.course || "—"}</td>
                    <td>{r.dateText}</td>
                    <td>
                      <span className={`cert-pill ${r.savedToCloudinary ? "cert-pill-ok" : "cert-pill-bad"}`}>
                        {r.savedToCloudinary ? "Cloudinary" : "Local"}
                      </span>
                    </td>
                    <td className="cert-links">
                      <a href={apiUrl(`/api/pdf/${encodeURIComponent(r.id)}`)} target="_blank" rel="noreferrer">
                        PDF ↓
                      </a>
                      <a href={`${base}/v/${encodeURIComponent(r.id)}`} target="_blank" rel="noreferrer">
                        Verify
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
