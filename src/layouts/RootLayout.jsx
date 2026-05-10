import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <>
      <Navbar />

      <main>
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default RootLayout;
