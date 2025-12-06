import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedHR({ children }) {
  const { isHRSignedIn } = useAuth();

  if (!isHRSignedIn) {
    console.log("ProtectedHR: Not signed in as HR, redirecting to /LoginHR");
    return <Navigate to="/LoginHR" replace />;
  }

  return children;
}

export default ProtectedHR;