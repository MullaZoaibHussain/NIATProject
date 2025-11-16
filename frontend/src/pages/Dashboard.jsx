import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  if (!token) navigate("/");

  const loadData = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/tickets", {
      headers: { Authorization: "Bearer " + token },
    });
    setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.post(
      "http://localhost:5000/api/tickets/" + id + "/status",
      { status },
      { headers: { Authorization: "Bearer " + token } }
    );
    loadData();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading tickets...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2>Welcome, {name}</h2>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <Link to="/create-ticket" className="btn btn-primary me-2">
            + Create Ticket
          </Link>

          {role === "admin" && (
            <Link to="/analytics" className="btn btn-secondary">
              Analytics
            </Link>
          )}
        </div>

        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card p-3 shadow">
        <h4>Your Tickets</h4>
        <hr />

        {tickets.length === 0 && <p>No tickets found.</p>}

        {tickets.map((t) => (
          <div key={t._id} className="border p-3 mb-3 rounded">
            <h5>
              {t.title} ({t.ticketId})
            </h5>
            <p>{t.description}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                className={`badge ${
                  t.status === "resolved"
                    ? "bg-success"
                    : t.status === "in-progress"
                    ? "bg-primary"
                    : "bg-warning text-dark"
                }`}
              >
                {t.status}
              </span>
            </p>

            <p><b>Category:</b> {t.category}</p>
            <p><b>Priority:</b> {t.priority}</p>
            <p><b>Department:</b> {t.department}</p>

            {role === "admin" && (
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateStatus(t._id, "resolved")}
                >
                  Mark Resolved
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => updateStatus(t._id, "in-progress")}
                >
                  In Progress
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
