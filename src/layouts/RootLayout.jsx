import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
