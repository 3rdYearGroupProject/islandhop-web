import React from 'react';
import Sidebar from './sidebars/Sidebar';

const MobileMenu = ({ isOpen, onClose, userRole }) => {
  return (
    <div className="lg:hidden">
      <Sidebar 
        isOpen={isOpen} 
        onClose={onClose} 
        userRole={userRole} 
      />
    </div>
  );
};

export default MobileMenu;
