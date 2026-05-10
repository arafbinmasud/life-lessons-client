import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
      <Footer/>
    </>
  );
};

export default AuthLayout;
