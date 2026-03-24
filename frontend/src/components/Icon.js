import React from "react";

const icons = {
  dashboard: "M4 5.75A1.75 1.75 0 0 1 5.75 4h4.5A1.75 1.75 0 0 1 12 5.75v4.5A1.75 1.75 0 0 1 10.25 12h-4.5A1.75 1.75 0 0 1 4 10.25zm8 0A1.75 1.75 0 0 1 13.75 4h4.5A1.75 1.75 0 0 1 20 5.75v4.5A1.75 1.75 0 0 1 18.25 12h-4.5A1.75 1.75 0 0 1 12 10.25zm-8 8A1.75 1.75 0 0 1 5.75 12h4.5A1.75 1.75 0 0 1 12 13.75v4.5A1.75 1.75 0 0 1 10.25 20h-4.5A1.75 1.75 0 0 1 4 18.25zm8 0A1.75 1.75 0 0 1 13.75 12h4.5A1.75 1.75 0 0 1 20 13.75v4.5A1.75 1.75 0 0 1 18.25 20h-4.5A1.75 1.75 0 0 1 12 18.25Z",
  jobs: "M7.5 6.5A2.5 2.5 0 0 1 10 4h4a2.5 2.5 0 0 1 2.5 2.5V8H20a1 1 0 0 1 1 1v8.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5V9a1 1 0 0 1 1-1h3.5zm2 1.5h5V6.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5Z",
  tracking: "M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6z",
  interviews: "M7 4a1 1 0 0 1 1 1v1h8V5a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a1 1 0 0 1 1-1Z",
  notifications: "M12 4a4 4 0 0 1 4 4v1.4c0 .52.18 1.03.52 1.42L18 12.5V14H6v-1.5l1.48-1.68c.34-.39.52-.9.52-1.42V8a4 4 0 0 1 4-4Z",
  profile: "M12 4.5A3.5 3.5 0 1 1 8.5 8 3.5 3.5 0 0 1 12 4.5Zm0 8a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7Z",
  search: "M10.5 5.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-2a7 7 0 1 1-4.95 11.95L2.8 18.2l-1.4-1.4 2.75-2.75A7 7 0 0 1 10.5 3.5Z",
  building: "M6.5 4h11A1.5 1.5 0 0 1 19 5.5V20h-2v-2.5a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 11 17.5V20H5V5.5A1.5 1.5 0 0 1 6.5 4ZM8 8h2v2H8Zm6 0h2v2h-2ZM8 12h2v2H8Zm6 0h2v2h-2Z",
  location: "M12 20s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10Zm0-7.5A2.5 2.5 0 1 0 12 7a2.5 2.5 0 0 0 0 5.5Z",
  calendar: "M7 3h2v2h6V3h2v2h1.5A2.5 2.5 0 0 1 21 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10A2.5 2.5 0 0 1 5.5 5H7V3Zm12 7H5v7.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5Z",
  clock: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm1 4h-2v4.41l2.8 2.8 1.4-1.42L13 11.59Z",
  user: "M12 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 8c3.31 0 6 2.02 6 4.5V19H6v-1.5C6 15.02 8.69 13 12 13Z",
  mail: "M5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9A1.5 1.5 0 0 1 5.5 6Zm0 2v.24L12 12.3l6.5-4.06V8L12 12.06Z",
  lock: "M9 10V8.5a3 3 0 1 1 6 0V10h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1Zm2 0h2V8.5a1 1 0 1 0-2 0Z",
  spark: "m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z",
  document: "M8 3.5h5.5L18.5 8v11A1.5 1.5 0 0 1 17 20.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5Zm5 1.9V8h2.6L13 5.4ZM9 11h6v1.8H9Zm0 3.7h6v1.8H9Z",
  upload: "M12 5.5 8.5 9 9.9 10.4 11 9.3V16h2V9.3l1.1 1.1L15.5 9 12 5.5Zm-6.5 10H7V18h10v-2.5h1.5A1.5 1.5 0 0 1 20 17v1A2 2 0 0 1 18 20H6a2 2 0 0 1-2-2v-1a1.5 1.5 0 0 1 1.5-1.5Z",
  check: "m6.5 12 3 3L17.5 7",
  pulse: "M4 13h3l2-4 3 8 2-4h6",
  trash: "M5 7h14v2H5V7Zm3 3h2v7H8v-7Zm6 0h2v7h-2v-7ZM9 4h6l1 2H8l1-2Z",
  eye: "M12 7c5.1 0 8.1 5 8.1 5s-3 5-8.1 5-8.1-5-8.1-5S6.9 7 12 7Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  chevronDown: "m7 10 5 5 5-5",
  arrowRight: "M5 12h14m-4-4 4 4-4 4",
  moon: "M15.5 4.5a7.5 7.5 0 1 0 4 13.86A8.7 8.7 0 0 1 15.5 4.5Z",
  sun: "M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-3h.01M12 21h.01M4.22 4.22l.01.01M19.77 19.77l.01.01M3 12h.01M21 12h.01M4.22 19.78l.01-.01M19.77 4.23l.01-.01",
  logout: "M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m4-12H8m6-4 4 4-4 4"
};

const stroked = new Set(["check", "pulse", "chevronDown", "arrowRight", "sun", "logout"]);

const Icon = ({ name, className = "", size = 20, ...props }) => {
  const d = icons[name];
  if (!d) return null;

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d={d}
        fill={stroked.has(name) ? "none" : "currentColor"}
        stroke={stroked.has(name) ? "currentColor" : "none"}
        strokeWidth={stroked.has(name) ? "1.8" : undefined}
        strokeLinecap={stroked.has(name) ? "round" : undefined}
        strokeLinejoin={stroked.has(name) ? "round" : undefined}
      />
    </svg>
  );
};

export default Icon;
