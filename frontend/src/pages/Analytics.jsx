import axios from "axios";
import { useEffect, useState } from "react";

function Analytics() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    const res = await axios.get("http://localhost:5000/api/tickets", {
      headers: { Authorization: "Bearer " + token },
    });

    const data = res.data;

    setStats({
      total: data.length,
      open: data.filter((t) => t.status === "open").length,
      progress: data.filter((t) => t.status === "in-progress").length,
      resolved: data.filter((t) => t.status === "resolved").length,
      categories: data.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {}),
    });
  };

  useEffect(() => {
    if (role !== "admin") return;
    loadStats();
  }, []);

  if (!stats)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2>Admin Analytics</h2>
      <hr />

      <div className="card p-3 shadow mb-4">
        <h4>Overview</h4>
        <p>Total Tickets: {stats.total}</p>
        <p>Open: {stats.open}</p>
        <p>In Progress: {stats.progress}</p>
        <p>Resolved: {stats.resolved}</p>
      </div>

      <div className="card p-3 shadow">
        <h4>Category Breakdown</h4>
        {Object.keys(stats.categories).map((c) => (
          <p key={c}>
            {c}: {stats.categories[c]}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Analytics;
