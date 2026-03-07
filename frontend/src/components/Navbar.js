import React from "react";

const Navbar = ({ title, user }) => {
  return (
    <header className="navbar">
      <div>
        <h2>{title}</h2>
        <p>Welcome, {user?.name || "User"}</p>
      </div>
      <span className="role-chip">{user?.role || "guest"}</span>
    </header>
  );
};

export default Navbar;
