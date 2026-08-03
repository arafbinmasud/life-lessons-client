import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import useRole from "../hooks/useRole";
import { makeAuthValue, renderWithProviders } from "../test/utils";
import DropDown from "./DropDown";

vi.mock("../hooks/useRole");
vi.mock("react-toastify", () => ({
  toast: { info: vi.fn(), error: vi.fn() },
}));

const user = {
  displayName: "Araf",
  photoURL: "https://example.com/araf.png",
};

describe("DropDown", () => {
  beforeEach(() => {
    useRole.mockReturnValue({ role: "user", loading: false });
  });

  it("shows a spinner while auth or role data is loading", () => {
    useRole.mockReturnValue({ role: "user", loading: true });

    const { container } = renderWithProviders(<DropDown />, {
      auth: makeAuthValue({ user }),
    });

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Araf")).not.toBeInTheDocument();
  });

  it("renders the user menu with the profile photo and display name", () => {
    renderWithProviders(<DropDown />, { auth: makeAuthValue({ user }) });

    expect(screen.getByAltText("User")).toHaveAttribute("src", user.photoURL);
    expect(screen.getByText("Araf")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/dashboard/profile",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("falls back to the default avatar when the user has no photo", () => {
    renderWithProviders(<DropDown />, {
      auth: makeAuthValue({ user: { displayName: "Araf" } }),
    });

    expect(screen.getByAltText("User")).toHaveAttribute(
      "src",
      expect.stringContaining("user"),
    );
  });

  it("links admins to the admin dashboard instead of the user dashboard", () => {
    useRole.mockReturnValue({ role: "admin", loading: false });

    renderWithProviders(<DropDown />, { auth: makeAuthValue({ user }) });

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard/admin",
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/dashboard/admin/profile",
    );
  });

  it("toasts a confirmation after a successful logout", async () => {
    const logoutUser = vi.fn(() => Promise.resolve());
    renderWithProviders(<DropDown />, {
      auth: makeAuthValue({ user, logoutUser }),
    });

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(logoutUser).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith("Logout Successful"),
    );
  });

  it("toasts the failure reason when logout rejects", async () => {
    const logoutUser = vi.fn(() => Promise.reject(new Error("network down")));
    renderWithProviders(<DropDown />, {
      auth: makeAuthValue({ user, logoutUser }),
    });

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("network down"),
    );
    expect(toast.info).not.toHaveBeenCalled();
  });
});
