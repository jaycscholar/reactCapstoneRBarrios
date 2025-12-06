import React from 'react';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Protected({ children }) {
  const { isSignedIn } = useAuth();

 if (!isSignedIn) {
 console.log("Employee: Not signed in, redirecting to /LoginEmployee");
 return <Navigate to="/LoginEmployee" replace />;
 }
 return children;
}

export default Protected;



