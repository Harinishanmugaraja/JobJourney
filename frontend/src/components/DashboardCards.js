import React from "react";

const DashboardCards = ({ items }) => {
  return (
    <section className="card-grid">
      {items.map((item) => (
        <div key={item.label} className="dash-card">
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </div>
      ))}
    </section>
  );
};

export default DashboardCards;
