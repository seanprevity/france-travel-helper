import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, setUser } = useContext(AuthContext);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch('/api/verify-token', {
          credentials: 'include',
        });

        if (res.ok) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setUser(null); 
          localStorage.removeItem('user'); 
        }
      } catch (err) {
        setTokenValid(false);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    if (!loading && user) {
      checkToken();
    }
  }, [loading, user, setUser]);

  if (loading || (user && tokenValid === null)) {
    return <div>Loading...</div>;
  }

  if (!user || tokenValid === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
