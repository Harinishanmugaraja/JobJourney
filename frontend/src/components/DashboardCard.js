import React from "react";
import Icon from "./Icon";

const DashboardCard = ({ label, value, helper, icon = "dashboard", trend }) => (
  <article className="dash-card">
    <div className="dash-card-top">
      <span className="metric-icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
      {trend ? <span className="metric-trend">{trend}</span> : null}
    </div>
    <p>{label}</p>
    <h3>{value}</h3>
    {helper ? <p className="dash-card-footnote">{helper}</p> : null}
  </article>
);

export default DashboardCard;
