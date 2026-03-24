import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import BrandHeader from "../components/BrandHeader";
import Icon from "../components/Icon";
import { getDashboardPathByRole } from "../utils/roles";

const LoginPage = ({ setToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
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
        <div className="auth-form-pane">
          <form className="auth-card" onSubmit={submit}>
            <BrandHeader className="auth-brand" />
            <div className="section-title-group">
              <h2>Login</h2>
              <p>Access your workspace and continue managing applications with a clean focused layout.</p>
            </div>
            <div className="auth-form">
              <div className="field">
                <label htmlFor="login-email">Email address</label>
                <div className="input-wrap">
                  <span className="auth-input-icon">
                    <Icon name="mail" />
                  </span>
                  <input
                    id="login-email"
                    className="input with-icon"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrap">
                  <span className="auth-input-icon">
                    <Icon name="lock" />
                  </span>
                  <input
                    id="login-password"
                    className="input with-icon"
                    type="password"
                    required
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                  />
                </div>
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
            <div className="auth-link-row">
              <span>New here?</span>
              <Link className="auth-link" to="/register">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
      {loading ? <Loader /> : null}
    </div>
  );
};

export default LoginPage;
