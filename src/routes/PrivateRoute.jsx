import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
// import Loader from "../components/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!user) {
    return <Navigate to="/authentication/login" state={location.pathname} />;
  }
  return children;
};

export default PrivateRoute;
