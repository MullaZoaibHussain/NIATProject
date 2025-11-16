import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("IT");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const submitTicket = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/tickets",
        { title, description, department },
        { headers: { Authorization: "Bearer " + token } }
      );

      alert("Ticket created!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Create Ticket</h2>

      <form className="card p-4 shadow" onSubmit={submitTicket}>
        <input
          className="form-control mb-3"
          placeholder="Issue Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Describe issue"
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="form-control mb-3"
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="IT">IT Department</option>
          <option value="Admin">Administration</option>
          <option value="Academics">Academics</option>
          <option value="Transport">Transport</option>
          <option value="Hostel">Hostel</option>
        </select>

        <button className="btn btn-primary w-100">Submit Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicket;
