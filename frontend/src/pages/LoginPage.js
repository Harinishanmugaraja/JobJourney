import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import BrandHeader from "../components/BrandHeader";
import AuthIllustration from "../components/AuthIllustration";
import { getDashboardPathByRole } from "../utils/roles";

const LoginPage = ({ setToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      setToast({ type: "success", message: "Login successful" });
      navigate(getDashboardPathByRole(data.user.role));
    } catch (error) {
      setToast({ type: "error", message: error.response?.data?.message || "Login failed" });
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
            <h2>Welcome Back</h2>
            <p>Sign in to continue managing your applications.</p>
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
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
            <Link to="/register">Create account</Link>
          </form>
        </div>
      </section>
      {loading && <Loader />}
    </div>
  );
};

export default LoginPage;
