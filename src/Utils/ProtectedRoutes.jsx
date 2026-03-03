import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function ProtectedRoutes({ children, roles }) {
  const { role: ctxRole, isAuthorized } = useContext(AuthContext);
  const location = useLocation();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const isAuth =
    typeof isAuthorized === "boolean"
      ? isAuthorized
      : Boolean(token);

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles) {
    const userRole = String(ctxRole || "").toLowerCase();
    const allowedRoles = Array.isArray(roles)
      ? roles.map(r => String(r).toLowerCase())
      : [String(roles).toLowerCase()];

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoutes;
