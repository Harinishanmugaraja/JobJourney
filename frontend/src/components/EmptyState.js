import React from "react";
import Icon from "./Icon";

const EmptyState = ({ icon = "spark", title, description, action }) => (
  <section className="section-card empty-state">
    <div className="empty-state-icon" aria-hidden="true">
      <Icon name={icon} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action || null}
  </section>
);

export default EmptyState;
