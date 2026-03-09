import React from "react";
import { ReactComponent as JobIllustrationSvg } from "../assets/JobIllustration.svg";

const AuthIllustration = () => {
  return (
    <div className="auth-visual" aria-hidden="true">
      <JobIllustrationSvg className="job-illustration" />
    </div>
  );
};

export default AuthIllustration;
