import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      window.location.href = "/dashboard";
    } catch (error) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 60 }}>
      <h2 className="mb-4 text-center">Login</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleLogin}>
        <input className="form-control mb-3" type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-dark w-100">Login</button>
      </form>
      <p className="mt-3 text-center">Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
