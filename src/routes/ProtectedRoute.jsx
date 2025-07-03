import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api/axios';

const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'support':
      return '/support';
    case 'guide':
      return '/guide';
    case 'driver':
      return '/driver';
    case 'tourist':
    default:
      return '/';
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Try to get user role from backend session
          const res = await api.get('/role'); // Assumes /me returns { role: ... }
          console.log(res);
          if (res.data && res.data.role) {
            setRole(res.data.role);
          } else {
            setRole('guest'); // fallback
          }
        } catch {
          setRole('guest'); // fallback if API fails
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getRedirectPath(role)} replace />;
  }
  return children;
};

export default ProtectedRoute;
