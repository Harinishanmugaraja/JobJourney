import React from "react";
import { ReactComponent as JobIllustrationSvg } from "../assets/JobIllustration.svg";
import BrandHeader from "./BrandHeader";
import Icon from "./Icon";

const features = [
  { icon: "dashboard", title: "Live pipeline clarity", text: "Review applications, interviews, and outcomes in one workspace." },
  { icon: "notifications", title: "Timely notifications", text: "Keep candidate and hiring updates visible without clutter." },
  { icon: "tracking", title: "Clean tracking flow", text: "Move from submission to offer tracking with clear status context." }
];

const AuthIllustration = () => {
  return (
    <div className="auth-visual" aria-hidden="true">
      <div className="auth-visual-body">
        <div className="auth-visual-copy">
          <BrandHeader />
          <h2>Organize every application with a polished hiring workspace.</h2>
          <p>Designed for realistic job search and recruitment flows, with clear hierarchy, focused insights, and a refined production feel.</p>
        </div>
        <div className="auth-feature-list">
          {features.map((feature) => (
            <div key={feature.title} className="auth-feature-item">
              <span className="auth-feature-icon">
                <Icon name={feature.icon} />
              </span>
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="auth-illustration-panel">
          <JobIllustrationSvg className="job-illustration" />
        </div>
      </div>
    </div>
  );
};

export default AuthIllustration;
