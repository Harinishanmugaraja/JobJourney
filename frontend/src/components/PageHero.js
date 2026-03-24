import React from "react";

const PageHero = ({ badge, title, description, stats = [], actions, visual }) => (
  <section className="page-hero">
    <div className="page-hero-content">
      <div className="hero-copy">
        {badge ? <span className="hero-badge">{badge}</span> : null}
        <h1>{title}</h1>
        <p>{description}</p>
        {stats.length ? (
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                {stat.helper ? <small>{stat.helper}</small> : null}
              </div>
            ))}
          </div>
        ) : null}
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
      {visual ? <div className="hero-visual">{visual}</div> : null}
    </div>
  </section>
);

export default PageHero;
