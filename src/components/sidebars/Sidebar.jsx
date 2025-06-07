import React, { useState } from 'react';
import { 
  Home, 
  Map, 
  Car, 
  MessageCircle, 
  Headphones, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import './Sidebar.css';
import islandHopLogo from '../../assets/IslandHop.png';
import islandHopIcon from '../../assets/islandHopIcon.png';

const Sidebar = ({ currentPage, onPageChange }) => {
  const [collapsedSections, setCollapsedSections] = useState({
    general: false,
    trips: false,
    messaging: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={islandHopIcon} alt="IslandHop Icon" className="logo-icon" />
        <img src={islandHopLogo} alt="IslandHop Logo" className="logo-image" />
      </div>

      <div 
        className="sidebar-section-title first"
        onClick={() => toggleSection('general')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        GENERAL
        <span className={`chevron-icon ${collapsedSections.general ? 'rotated' : ''}`}>
          <ChevronDown size={14} />
        </span>
      </div>
      <div className={`section-content ${collapsedSections.general ? 'collapsed' : 'expanded'}`}>
        <div style={{ animationDelay: '0ms' }}>
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            isActive={currentPage === 'Home'}
            onClick={() => onPageChange('Home')}
            iconColor="#3B82F6"
          />
        </div>
      </div>

      <div 
        className="sidebar-section-title"
        onClick={() => toggleSection('trips')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        TRIPS
        <span className={`chevron-icon ${collapsedSections.trips ? 'rotated' : ''}`}>
          <ChevronDown size={14} />
        </span>
      </div>
      <div className={`section-content ${collapsedSections.trips ? 'collapsed' : 'expanded'}`}>
        <div style={{ animationDelay: '0ms' }}>
          <SidebarItem
            icon={<Map size={18} />}
            label="Trips"
            isActive={currentPage === 'Trips'}
            onClick={() => onPageChange('Trips')}
            iconColor="#10B981"
          />
        </div>
        <div style={{ animationDelay: '50ms' }}>
          <SidebarItem
            icon={<Car size={18} />}
            label="Ride Pools"
            isActive={currentPage === 'RidePools'}
            onClick={() => onPageChange('RidePools')}
            iconColor="#F59E0B"
          />
        </div>
      </div>

      <div 
        className="sidebar-section-title"
        onClick={() => toggleSection('messaging')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        MESSAGING & SUPPORT
        <span className={`chevron-icon ${collapsedSections.messaging ? 'rotated' : ''}`}>
          <ChevronDown size={14} />
        </span>
      </div>
      <div className={`section-content ${collapsedSections.messaging ? 'collapsed' : 'expanded'}`}>
        <div style={{ animationDelay: '0ms' }}>
          <SidebarItem
            icon={<MessageCircle size={18} />}
            label="Messaging"
            isActive={currentPage === 'Messaging'}
            onClick={() => onPageChange('Messaging')}
            iconColor="#8B5CF6"
          />
        </div>
        <div style={{ animationDelay: '50ms' }}>
          <SidebarItem
            icon={<Headphones size={18} />}
            label="Support"
            isActive={currentPage === 'Support'}
            onClick={() => onPageChange('Support')}
            iconColor="#06B6D4"
          />
        </div>
        <div style={{ animationDelay: '100ms' }}>
          <SidebarItem
            icon={<AlertTriangle size={18} />}
            label="Emergency"
            isActive={currentPage === 'Emergency'}
            onClick={() => onPageChange('Emergency')}
            iconColor="#EF4444"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;