import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import AuthLayout from "./AuthLayout";
import RootLayout from "./RootLayout";

vi.mock("../components/Navbar", () => ({
  default: () => <nav data-testid="navbar" />,
}));
vi.mock("../components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

const renderLayout = (Layout) =>
  render(
    <MemoryRouter initialEntries={["/child"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/child" element={<p>routed page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe.each([
  ["RootLayout", RootLayout],
  ["AuthLayout", AuthLayout],
])("%s", (_name, Layout) => {
  it("frames the routed page with the navbar and footer", () => {
    renderLayout(Layout);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("routed page")).toBeInTheDocument();
  });
});
