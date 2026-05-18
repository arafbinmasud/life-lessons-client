import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/authentication/register/Register";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/authentication/login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/dashboard/dashboard-overview/DashboardOverview";
import AddLesson from "../pages/dashboard/add-lesson/AddLesson";
import PrivateRoute from "./PrivateRoute";
import MyLessons from "../pages/dashboard/my-lessons/MyLessons";
import UpgradePlan from "../pages/upgrade-plan/UpgradePlan";
import PaymentSuccess from "../pages/upgrade-plan/PaymentSuccess";
import PaymentCancel from "../pages/upgrade-plan/PaymentCancel";
import LessonDetails from "../pages/lesson-details/LessonDetails";
import AuthorLessons from "../pages/author-lessons/AuthorLessons";
import PublicLessons from "../pages/public-lessons/PublicLessons";
import MyFavorites from "../pages/dashboard/my-favorites/MyFavorites";
import NotFound from "../pages/not-found/NotFound";
import Profile from "../pages/dashboard/profile/Profile";
import AdminOverview from "../pages/dashboard/admin/admin-overview/AdminOverview";
import ManageUsers from "../pages/dashboard/admin/manage-users/ManageUsers";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/public-lessons",
        Component: PublicLessons,
      },
      {
        path: "/upgrade-plan",
        element: (
          <PrivateRoute>
            <UpgradePlan />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "/payment-cancel",
        Component: PaymentCancel,
      },
      {
        path: "/lesson-details/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/author-lessons/:authorId",
        element: (
          <PrivateRoute>
            <AuthorLessons />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/authentication",
    Component: AuthLayout,
    children: [
      {
        path: "register",
        Component: Register,
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, Component: DashboardOverview },
      {
        path: "add-lesson",
        element: (
          <PrivateRoute>
            <AddLesson />
          </PrivateRoute>
        ),
      },
      {
        path: "my-lessons",
        element: (
          <PrivateRoute>
            <MyLessons />
          </PrivateRoute>
        ),
      },
      {
        path: "my-favorites",
        element: (
          <PrivateRoute>
            <MyFavorites />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <AdminOverview />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <PrivateRoute>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
