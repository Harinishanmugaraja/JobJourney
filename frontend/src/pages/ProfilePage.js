import React, { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import { useAuth } from "../context/AuthContext";
import { formatRole } from "../utils/roles";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const ProfilePage = ({ setToast }) => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", avatar: user?.avatar || "" });
  const fileRef = useRef(null);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast?.({ type: "error", message: "Please choose an image file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, avatar: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setToast?.({ type: "error", message: "Name and email are required." });
      return;
    }

    updateProfile({ name: form.name.trim(), email: form.email.trim().toLowerCase(), avatar: form.avatar });
    setToast?.({ type: "success", message: "Profile updated." });
  };

  return (
    <DashboardLayout title="Profile">
      <PageHero
        badge="Personal Workspace"
        title="Keep your profile clean, current, and recognizable."
        description="The profile flow stays local to the current auth context, but now feels more like a refined SaaS settings page."
        stats={[
          { label: "Current role", value: formatRole(user?.role), helper: "Account access type" },
          { label: "Profile status", value: form.avatar ? "Custom avatar" : "Initials avatar", helper: "Visual identity" }
        ]}
        visual={<div className="hero-visual-card"><div className="hero-visual-row"><div><strong>Identity panel</strong><p className="section-empty-text">Update the essentials without clutter.</p></div><span className="mini-badge">{formatRole(user?.role)}</span></div><div className="hero-mini-chart" /></div>}
      />
      <section className="panel profile-panel">
        <div className="profile-card">
          <section className="profile-overview">
            <div className="profile-avatar-wrap">
              {form.avatar ? <img className="profile-avatar profile-avatar-lg" src={form.avatar} alt="Profile" /> : <div className="profile-avatar profile-avatar-lg profile-fallback">{getInitials(form.name)}</div>}
              <div className="profile-meta">
                <h3>{form.name || "User"}</h3>
                <p>{form.email || "user@example.com"}</p>
                <span className="role-chip">{formatRole(user?.role)}</span>
              </div>
              <input ref={fileRef} className="profile-file" type="file" accept="image/*" onChange={onFileChange} />
              <button className="btn btn-outline" type="button" onClick={() => fileRef.current?.click()}><Icon name="upload" />Change picture</button>
            </div>
            <div className="profile-stats">
              <div className="profile-stat"><span>Theme aware</span><strong>Light and dark</strong></div>
              <div className="profile-stat"><span>Session data</span><strong>Synced locally</strong></div>
            </div>
          </section>
          <form className="profile-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="profile-name">Name</label>
              <div className="input-wrap">
                <span className="input-icon"><Icon name="user" /></span>
                <input id="profile-name" className="input with-icon" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="profile-email">Email</label>
              <div className="input-wrap">
                <span className="input-icon"><Icon name="mail" /></span>
                <input id="profile-email" className="input with-icon" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
              </div>
            </div>
            <div className="field-static">
              <label htmlFor="profile-role">Role</label>
              <input id="profile-role" className="input" value={formatRole(user?.role)} readOnly />
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">Save profile</button>
            </div>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ProfilePage;
