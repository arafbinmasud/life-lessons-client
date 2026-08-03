import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useRole from "../hooks/useRole";
import { renderWithProviders } from "../test/utils";
import DashboardLayout from "./DashboardLayout";

vi.mock("../hooks/useRole");

const linkNames = () =>
  screen.getAllByRole("link").map((link) => link.textContent);

describe("DashboardLayout", () => {
  beforeEach(() => {
    useRole.mockReturnValue({ role: "user", loading: false });
  });

  it("shows a loader until the role is known", () => {
    useRole.mockReturnValue({ role: "user", loading: true });

    const { container } = renderWithProviders(<DashboardLayout />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the member sidebar for regular users", () => {
    renderWithProviders(<DashboardLayout />);

    expect(linkNames()).toEqual([
      "Homepage",
      "Overview",
      "Add Lesson",
      "My Lessons",
      "My Favorites",
      "Profile",
    ]);
  });

  it("renders the moderation sidebar for admins", () => {
    useRole.mockReturnValue({ role: "admin", loading: false });

    renderWithProviders(<DashboardLayout />);

    expect(linkNames()).toEqual([
      "Homepage",
      "Overview",
      "Manage Users",
      "Manage Lessons",
      "Profile",
    ]);
    expect(screen.getByRole("link", { name: "Manage Users" })).toHaveAttribute(
      "href",
      "/dashboard/admin/manage-users",
    );
  });
});
