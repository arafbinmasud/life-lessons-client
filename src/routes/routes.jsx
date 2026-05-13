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


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
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
    Component: DashboardLayout,
    children: [
      {index: true,
        Component:DashboardOverview
      },
      {
        path: "add-lesson",
        element: <PrivateRoute><AddLesson/></PrivateRoute>
      }
    ]
  }
]);

export default router;
