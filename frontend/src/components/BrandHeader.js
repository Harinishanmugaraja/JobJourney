import React from "react";

const BrandHeader = ({ className = "" }) => {
  return (
    <div className={`brand-header ${className}`.trim()}>
      <div className="brand-title-row">
        <span className="brand-logo" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="img">
            <defs>
              <linearGradient id="brandBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>
            <path
              fill="url(#brandBlueGradient)"
              d="M16 10h16a5 5 0 0 1 5 5v17a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6V15a5 5 0 0 1 5-5Zm3-2a5 5 0 0 1 10 0h4a7 7 0 0 0-14 0h4Z"
            />
            <path
              fill="#E0F2FE"
              d="m20.8 27.3 2.7 2.7 4.9-5a1.3 1.3 0 0 1 1.9 1.8l-5.8 5.9a1.4 1.4 0 0 1-2 0l-3.6-3.6a1.3 1.3 0 1 1 1.9-1.8Z"
            />
          </svg>
        </span>
        <h1>
          <span className="brand-job">Job</span>
          <span className="brand-journey">Journey</span>
        </h1>
      </div>
      <p className="brand-tagline">Track | Apply | Grow</p>
    </div>
  );
};

export default BrandHeader;
