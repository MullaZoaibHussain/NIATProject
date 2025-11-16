import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return (window.location.href = "/");
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tickets/analytics/summary`, { headers: { Authorization: `Bearer ${token}` }});
        setSummary(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (!summary) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Analytics</h2>
      <p><b>Total Tickets:</b> {summary.total}</p>

      <div className="row">
        <div className="col-md-6">
          <h5>By Status</h5>
          <ul>
            {summary.byStatus.map(s => <li key={s._id}>{s._id}: {s.count}</li>)}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>By Department</h5>
          <ul>
            {summary.byDepartment.map(d => <li key={d._id}>{d._id}: {d.count}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
