import React from "react";
import ProfileButton from "./ProfileButton";

const Navbar = ({ title, user }) => {
  return (
    <header className="navbar">
      <div>
        <h2>{title}</h2>
        <p>Welcome, {user?.name || "User"}</p>
      </div>
      <ProfileButton user={user} />
    </header>
  );
};

export default Navbar;
