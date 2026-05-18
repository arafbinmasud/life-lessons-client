import useAuth from "../hooks/useAuth";
import userImg from "../assets/user.png";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Loader from "./Loader";
import useRole from "../hooks/useRole";

const DropDown = () => {
  const { loading, user, logoutUser } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loader />;
  }

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        toast.info("Logout Successful");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className="dropdown dropdown-end select-none cursor-pointer">
      <div tabIndex={0} role="button">
        <div className="w-10 h-10 rounded-full border overflow-hidden border-gray-200">
          <img
            className="w-full h-full object-cover"
            src={user?.photoURL || userImg}
            alt="User"
          />
        </div>
      </div>
      <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-gray-100">
        <div className="px-4 py-2 border-b border-gray-100 mb-1">
          <p className="font-bold text-sm">{user?.displayName}</p>
        </div>

        {role === "user" && (
          <>
            <li>
              <Link to="/dashboard/profile" className="py-2">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="py-2">
                Dashboard
              </Link>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li>
              <Link to="/dashboard/admin" className="py-2">
                Dashboard
              </Link>
            </li>
          </>
        )}
        <li>
          <button onClick={handleLogout} className="text-red-500 py-2">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDown;
