import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import Loader from "../components/Loader";
import BrandHeader from "../components/BrandHeader";
import AuthIllustration from "../components/AuthIllustration";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegistrationPage = ({ setToast }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(form.email)) {
      setToast({ type: "error", message: "Invalid email format" });
      return;
    }
    if (form.password.length < 8) {
      setToast({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      setToast({ type: "success", message: "Registration completed" });
      navigate("/login");
    } catch (error) {
      setToast({ type: "error", message: error.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-shell">
        <AuthIllustration />
        <div className="auth-form-pane">
          <form className="auth-card" onSubmit={submit}>
            <BrandHeader className="auth-brand" />
            <h2>Create Account</h2>
            <p>Start tracking your opportunities in one place.</p>
            <input
              className="input"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
            <Link to="/login">Back to login</Link>
          </form>
        </div>
      </section>
      {loading && <Loader />}
    </div>
  );
};

export default RegistrationPage;
