import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatRole } from "../utils/roles";
import Icon from "./Icon";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const ProfileButton = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar-profile-wrap" ref={ref}>
      <button
        className="navbar-profile"
        data-open={open}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        {user?.avatar ? (
          <img className="profile-avatar" src={user.avatar} alt={user.name || "User"} />
        ) : (
          <div className="profile-avatar profile-fallback">{getInitials(user?.name || "User")}</div>
        )}
        <span className="navbar-profile-copy">
          <strong>{user?.name || "User"}</strong>
          <small>{formatRole(user?.role)}</small>
        </span>
        <Icon name="chevronDown" />
      </button>
      {open ? (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <strong>{user?.email || "No email available"}</strong>
            <span>{formatRole(user?.role)}</span>
          </div>
          <Link className="profile-menu-link" to="/profile" onClick={() => setOpen(false)}>
            <Icon name="profile" />
            My profile
          </Link>
          <Link className="profile-menu-link" to="/notifications" onClick={() => setOpen(false)}>
            <Icon name="notifications" />
            Notifications
          </Link>
          <button className="profile-menu-link" type="button" onClick={handleLogout}>
            <Icon name="logout" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileButton;
