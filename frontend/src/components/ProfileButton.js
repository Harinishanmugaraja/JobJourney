import React from "react";
import { useNavigate } from "react-router-dom";
import { formatRole } from "../utils/roles";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const ProfileButton = ({ user }) => {
  const navigate = useNavigate();

  return (
    <button className="navbar-profile" type="button" onClick={() => navigate("/profile")}>
      {user?.avatar ? (
        <img className="profile-avatar" src={user.avatar} alt="Profile" />
      ) : (
        <div className="profile-avatar profile-fallback">{getInitials(user?.name || "User")}</div>
      )}
      <span className="navbar-profile-copy">
        <strong>{user?.name || "User"}</strong>
        <small>{formatRole(user?.role)}</small>
      </span>
    </button>
  );
};

export default ProfileButton;
