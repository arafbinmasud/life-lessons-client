import { FiPlusCircle } from "react-icons/fi";
import { NavLink, Outlet } from "react-router";
import Container from "../components/Container";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaBookmark, FaUser } from "react-icons/fa";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4">Digital Life Lessons</div>
        </nav>

        {/* Page content here */}
        <div>
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            {/* homepage  */}
            <li>
              <NavLink
                to="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Homepage</span>
              </NavLink>
            </li>

            {/* My List items  */}
            {/* overview page  */}
            <li>
              <NavLink
                to="/dashboard"
                end
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Overview"
              >
                <MdOutlineDashboard />
                <span className="is-drawer-close:hidden">Overview</span>
              </NavLink>
            </li>
            {/* add lesson  */}
            <li>
              <NavLink
                to="/dashboard/add-lesson"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Add Lesson"
              >
                <FiPlusCircle />
                <span className="is-drawer-close:hidden">Add Lesson</span>
              </NavLink>
            </li>
            {/* my lessons  */}
            <li>
              <NavLink
                to="/dashboard/my-lessons"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Lessons"
              >
                <HiOutlineBookOpen />
                <span className="is-drawer-close:hidden">My Lessons</span>
              </NavLink>
            </li>
            {/* my favorites  */}
            <li>
              <NavLink
                to="/dashboard/my-favorites"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Favorites"
              >
                <FaBookmark />
                <span className="is-drawer-close:hidden">My Favorites</span>
              </NavLink>
            </li>
            {/* my profile  */}
            <li>
              <NavLink
                to="/dashboard/profile"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Profile"
              >
                <FaUser />
                <span className="is-drawer-close:hidden">Profile</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
