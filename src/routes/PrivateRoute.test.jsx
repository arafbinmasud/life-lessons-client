import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "../contexts/AuthContext";
import { makeAuthValue } from "../test/utils";
import PrivateRoute from "./PrivateRoute";

const renderPrivateRoute = (auth) =>
  render(
    <AuthContext value={auth}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <p>secret content</p>
              </PrivateRoute>
            }
          />
          <Route path="/authentication/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext>,
  );

describe("PrivateRoute", () => {
  it("shows a spinner while the auth state is loading", () => {
    const { container } = renderPrivateRoute(makeAuthValue({ loading: true }));

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
    expect(screen.queryByText("login page")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated visitors to the login page", () => {
    renderPrivateRoute(makeAuthValue({ user: null, loading: false }));

    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("renders the protected children for an authenticated user", () => {
    renderPrivateRoute(
      makeAuthValue({ user: { email: "user@example.com" }, loading: false }),
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});
