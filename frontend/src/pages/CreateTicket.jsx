import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const DEPARTMENTS = ["IT","Admin","Hostel","Transport","Academics"];

export default function CreateTicket() {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [department, setDepartment] = useState("IT");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/tickets`, { title, description, department }, { headers: { Authorization: `Bearer ${token}` }});
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error creating ticket");
    } finally { setLoading(false); }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 800 }}>
      <h2>Create Ticket</h2>
      <form onSubmit={submit}>
        <input className="form-control mb-3" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="form-control mb-3" placeholder="Describe the issue" value={description} onChange={e=>setDescription(e.target.value)} required />
        <select className="form-select mb-3" value={department} onChange={e=>setDepartment(e.target.value)}>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className="btn btn-dark" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
}
