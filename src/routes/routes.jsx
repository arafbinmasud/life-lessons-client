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
        path: "/upgrade-plan",
        element: <PrivateRoute><UpgradePlan/></PrivateRoute>
      },
      {
        path: "/payment-success",
        Component: PaymentSuccess
      },
      {
        path: "/payment-cancel",
        Component: PaymentCancel
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
      },
      {
        path: "my-lessons",
        element: <PrivateRoute><MyLessons/></PrivateRoute>
      },
    ]
  }
]);

export default router;
