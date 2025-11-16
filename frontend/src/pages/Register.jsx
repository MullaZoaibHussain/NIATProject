import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      window.location.href = "/";
    } catch (error) {
      setErr(error?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 40 }}>
      <h2 className="mb-4 text-center">Register</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleRegister}>
        <input className="form-control mb-3" placeholder="Name" onChange={e=>setName(e.target.value)} required />
        <input className="form-control mb-3" type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-dark w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-3 text-center">Already have an account? <a href="/">Login</a></p>
    </div>
  );
}
