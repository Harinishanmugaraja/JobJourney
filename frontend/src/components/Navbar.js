import React from "react";
import ProfileButton from "./ProfileButton";
import { formatRole } from "../utils/roles";
import NotificationBell from "./NotificationBell";

const Navbar = ({ title, user }) => {
  return (
    <header className="navbar">
      <div className="navbar-heading">
        <span className="navbar-eyebrow">{formatRole(user?.role)}</span>
        <h2>{title}</h2>
        <p>Welcome back, {user?.name || "User"}. Your workspace is synced with the latest backend data.</p>
      </div>
      <div className="navbar-actions">
        <NotificationBell />
        <ProfileButton user={user} />
      </div>
    </header>
  );
};

export default Navbar;
