import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";


const ProtectedRoute = ({ children, type }) => {
    const { isLoggedIn: loggedIn } = useAuth();


    if ((type === "auth" || type === "guest") && loggedIn) {
        return <Navigate to="/homedashboard" replace />;
    }

    if (type === "private" && !loggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
