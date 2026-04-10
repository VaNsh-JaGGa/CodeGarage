import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children, type }) => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    useEffect(() => {
        if (type === "auth" && isLoggedIn) {
            navigate("/realhome", { replace: true });
        }

        if (type === "private" && !isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, type, navigate]);

    return children;
};

export default ProtectedRoute;