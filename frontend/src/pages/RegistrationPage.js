import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import Loader from "../components/Loader";
import BrandHeader from "../components/BrandHeader";
import Icon from "../components/Icon";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegistrationPage = ({ setToast }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(form.email)) return setToast({ type: "error", message: "Invalid email format" });
    if (form.password.length < 8) return setToast({ type: "error", message: "Password must be at least 8 characters" });

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
        <div className="auth-form-pane">
          <form className="auth-card" onSubmit={submit}>
            <BrandHeader className="auth-brand" />
            <div className="section-title-group">
              <h2>Register</h2>
              <p>Create your account and start using the tracker with a simpler centered experience.</p>
            </div>
            <div className="auth-form">
              <div className="field">
                <label htmlFor="register-name">Full name</label>
                <div className="input-wrap">
                  <span className="auth-input-icon"><Icon name="user" /></span>
                  <input id="register-name" className="input with-icon" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="register-email">Email address</label>
                <div className="input-wrap">
                  <span className="auth-input-icon"><Icon name="mail" /></span>
                  <input id="register-email" className="input with-icon" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="register-password">Password</label>
                <div className="input-wrap">
                  <span className="auth-input-icon"><Icon name="lock" /></span>
                  <input id="register-password" className="input with-icon" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                </div>
                <span className="field-hint">Use at least 8 characters.</span>
              </div>
              <div className="field">
                <label htmlFor="register-role">Role</label>
                <div className="input-wrap">
                  <span className="auth-input-icon"><Icon name="spark" /></span>
                  <select id="register-role" className="input with-icon" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                    <option value="jobseeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
              </div>
              <button className="btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
            </div>
            <div className="auth-link-row">
              <span>Already have an account?</span>
              <Link className="auth-link" to="/login">Back to login</Link>
            </div>
          </form>
        </div>
      </section>
      {loading ? <Loader /> : null}
    </div>
  );
};

export default RegistrationPage;
