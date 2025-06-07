import React from 'react';
import './SidebarItem.css';

const SidebarItem = ({ icon, label, isActive, onClick, iconColor }) => {
  return (
    <div
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span 
        className="sidebar-item-icon" 
        style={{ color: isActive ? '#1E90FF' : iconColor }}
      >
        {icon}
      </span>
      <span className="sidebar-item-label">
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;