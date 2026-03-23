import React, { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
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
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  });
  const fileRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast?.({ type: "error", message: "Please choose an image file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setToast?.({ type: "error", message: "Name and email are required." });
      return;
    }

    updateProfile({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      avatar: form.avatar
    });
    setToast?.({ type: "success", message: "Profile updated." });
  };

  return (
    <DashboardLayout title="Profile">
      <section className="panel profile-panel">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {form.avatar ? (
              <img className="profile-avatar profile-avatar-lg" src={form.avatar} alt="Profile" />
            ) : (
              <div className="profile-avatar profile-avatar-lg profile-fallback">{getInitials(form.name)}</div>
            )}
            <div className="profile-meta">
              <h3>{form.name || "User"}</h3>
              <p>{form.email || "user@example.com"}</p>
              <span className="role-chip">{formatRole(user?.role)}</span>
            </div>
            <input
              ref={fileRef}
              className="profile-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <button className="btn btn-outline" type="button" onClick={() => fileRef.current?.click()}>
              Change Picture
            </button>
          </div>
          <form className="profile-form" onSubmit={submit}>
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <label htmlFor="profile-role">Role</label>
            <input id="profile-role" className="input" value={formatRole(user?.role)} readOnly />
            <button className="btn" type="submit">
              Save Profile
            </button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ProfilePage;
