import React, { useEffect } from 'react';
import { useToast } from '../../components/ToastProvider';
import { getUserData } from '../../utils/userStorage';
import { Link } from 'react-router-dom';

const TouristDashboard = () => {
  const toast = useToast();

  useEffect(() => {
    const user = getUserData();
    if (user && user.profileComplete === false) {
      toast.info(
        <span>
          Please complete your profile to enjoy all features!{' '}
          <Link to="/profile" className="underline text-primary-600 hover:text-primary-800 font-semibold">Go to Profile</Link>
        </span>,
        { duration: 6000 }
      );
    }
  }, [toast]);

  return (
    <div>
      {/* ...existing dashboard content... */}
      <h1>Tourist Dashboard</h1>
    </div>
  );
};

export default TouristDashboard;
