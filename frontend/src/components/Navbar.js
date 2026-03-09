import React from "react";
import { formatRole } from "../utils/roles";

const Navbar = ({ title, user }) => {
  return (
    <header className="navbar">
      <div>
        <h2>{title}</h2>
        <p>Welcome, {user?.name || "User"}</p>
      </div>
      <span className="role-chip">{formatRole(user?.role)}</span>
    </header>
  );
};

export default Navbar;
