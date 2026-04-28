import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!requireAuth && isLoggedIn) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "seller") return <Navigate to="/seller" replace />;
    return <Navigate to="/home" replace />;
  }

  if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "seller") return <Navigate to="/seller" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
