import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequiredAuth = ({ allowedAccess }) => {
    const {auth} = useAuth();
  const location = useLocation();
  console.log("Auth: ", auth);
  console.log(allowedAccess.some(item => item === auth.role));
  return allowedAccess.some(item => item === auth.role) ? (
    <Outlet />
  ) : auth.AccessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};



export default RequiredAuth;
