import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/authentication/register/Register";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";

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
    ],
  },
]);

export default router;
