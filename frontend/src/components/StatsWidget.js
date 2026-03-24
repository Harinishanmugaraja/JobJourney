import React from "react";
import DashboardCard from "./DashboardCard";

const StatsWidget = ({ items }) => (
  <section className="card-grid">
    {items.map((item) => (
      <DashboardCard
        key={item.label}
        label={item.label}
        value={item.value}
        helper={item.helper}
        icon={item.icon}
        trend={item.trend}
      />
    ))}
  </section>
);

export default StatsWidget;
