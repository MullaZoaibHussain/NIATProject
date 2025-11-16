import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function statusBadge(status) {
  const map = {
    open: "bg-warning text-dark",
    in_progress: "bg-info text-dark",
    resolved: "bg-success text-white",
    closed: "bg-secondary text-white"
  };
  return map[status] || "bg-light text-dark";
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return (window.location.href = "/");
    axios.get(`${API_URL}/api/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTickets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {name}</h2>
        <div>
          {role === "admin" && <a href="/analytics" className="btn btn-outline-primary me-2">Analytics</a>}
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <a className="btn btn-primary mt-3" href="/create-ticket">+ Create Ticket</a>

      <h3 className="mt-4">Your Tickets</h3>

      {loading ? <div className="mt-4">Loading...</div> : (
        tickets.length === 0 ? <div className="mt-3">No tickets yet.</div> :
        tickets.map(t => (
          <div className="card p-3 my-3" key={t._id}>
            <div className="d-flex justify-content-between">
              <h5>{t.title} <small>({t.ticketNumber})</small></h5>
              <span className={`badge ${statusBadge(t.status)}`}>{t.status}</span>
            </div>
            <p>{t.description}</p>
            <p><b>Category:</b> {t.category} &nbsp; <b>Priority:</b> {t.priority} &nbsp; <b>Department:</b> {t.department}</p>
            {role === "admin" && (
              <div className="mt-2">
                <select
                  defaultValue={t.status}
                  className="form-select form-select-sm"
                  style={{ width: 200 }}
                  onChange={async (e) => {
                    try {
                      await axios.post(`${API_URL}/api/tickets/${t._id}/status`, { status: e.target.value }, { headers: { Authorization: `Bearer ${token}` }});
                      // refresh
                      const res = await axios.get(`${API_URL}/api/tickets`, { headers: { Authorization: `Bearer ${token}` }});
                      setTickets(res.data);
                    } catch (err) {
                      alert("Status update failed");
                    }
                  }}
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                  <option value="closed">closed</option>
                </select>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
