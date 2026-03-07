import React from "react";

const NotificationPanel = ({ items }) => {
  return (
    <div className="panel">
      <h3>Notifications</h3>
      <ul className="notifications">
        {items.map((item, idx) => (
          <li key={`${item.message}-${idx}`}>
            <p>{item.message}</p>
            <span>{item.time}</span>
          </li>
        ))}
        {!items.length && <li>No notifications</li>}
      </ul>
    </div>
  );
};

export default NotificationPanel;
