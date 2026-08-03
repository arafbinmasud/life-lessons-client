import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <Loader />;
  }
  if (!user) {
    return <Navigate to="/authentication/login" state={location.pathname} />;
  }
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;
