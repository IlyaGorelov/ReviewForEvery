import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './Context/useAuth';

type Props = {children: React.ReactNode}

const ProtectedRouteForAdmin = ({children}: Props) => {
    const location = useLocation();
    const {isLoggedIn,user} = useAuth();
  return isLoggedIn() && user?.role.includes("Admin") ? (
    <>{children}</> ) : 
    (<Navigate to="/" state={{from: location}} replace />);
  
}

export default ProtectedRouteForAdmin