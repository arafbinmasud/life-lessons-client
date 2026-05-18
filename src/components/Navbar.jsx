import { Link, NavLink } from "react-router";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import DropDown from "./DropDown";
const Navbar = () => {
  const { user, loading } = useAuth();

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/add-lesson">Add Lesson</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/my-lessons">My Lessons</NavLink>
      </li>
      <li>
        <NavLink to="/public-lessons">Public Lessons</NavLink>
      </li>
      <li>
        <NavLink to="/upgrade-plan">Upgrade Plan</NavLink>
      </li>
    </>
  );
  return (
    <header className="shadow-sm sticky top-0 z-10">
      <nav className="navbar bg-base-100 max-w-350 mx-auto h-16">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <Link className="hidden md:block" to="/">
            <Logo />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>

        <div className="navbar-end flex items-center h-16">
          {loading ? (
            <div className="w-12 h-12 flex items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          ) : user ? (
            <div className="h-12 flex items-center">
              <DropDown />
            </div>
          ) : (
            <div className="flex gap-3 h-12 items-center">
              <Link className="btn btn-primary h-12 min-h-0">Login</Link>
              <Link className="btn btn-primary h-12 min-h-0">Register</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
