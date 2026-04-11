import { Navigate } from "react-router-dom";
import { checkLogin } from "../utils/api";

const ProtectedRoute = ({ children, type }) => {
    const loggedIn = checkLogin();

    if ((type === "auth" || type === "guest") && loggedIn) {
        return <Navigate to="/realhome" replace />;
    }

    if (type === "private" && !loggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
