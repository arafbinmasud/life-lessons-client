import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeAuthValue, renderWithProviders } from "../test/utils";
import Navbar from "./Navbar";

vi.mock("./DropDown", () => ({
  default: () => <div data-testid="dropdown" />,
}));

describe("Navbar", () => {
  it("renders the primary navigation links", () => {
    renderWithProviders(<Navbar />, { auth: makeAuthValue() });

    for (const label of [
      "Home",
      "Add Lesson",
      "My Lessons",
      "Public Lessons",
      "Upgrade Plan",
    ]) {
      // rendered twice: mobile drawer menu and desktop menu
      expect(screen.getAllByRole("link", { name: label })).toHaveLength(2);
    }
  });

  it("shows a spinner instead of account actions while auth is loading", () => {
    const { container } = renderWithProviders(<Navbar />, {
      auth: makeAuthValue({ loading: true }),
    });

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("offers login and register actions to anonymous visitors", () => {
    renderWithProviders(<Navbar />, { auth: makeAuthValue({ user: null }) });

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  it("shows the account dropdown for signed-in users", () => {
    renderWithProviders(<Navbar />, {
      auth: makeAuthValue({ user: { email: "user@example.com" } }),
    });

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });
});
