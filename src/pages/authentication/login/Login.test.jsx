import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import { makeAuthValue, renderWithProviders } from "../../../test/utils";
import Login from "./Login";

const navigate = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));
vi.mock("../social/Social", () => ({
  default: () => <button type="button">Continue with Google</button>,
}));

const fillCredentials = async (email, password) => {
  await userEvent.type(screen.getByPlaceholderText("Your Email"), email);
  await userEvent.type(screen.getByPlaceholderText("Your Password"), password);
};

const submit = () =>
  userEvent.click(screen.getByRole("button", { name: "Login" }));

describe("Login", () => {
  let loginUser;

  beforeEach(() => {
    loginUser = vi.fn(() =>
      Promise.resolve({ user: { displayName: "Araf" } }),
    );
  });

  const renderLogin = () =>
    renderWithProviders(<Login />, { auth: makeAuthValue({ loginUser }) });

  it("links new users to the register page", () => {
    renderLogin();

    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/authentication/register",
    );
  });

  it("requires both email and password", async () => {
    renderLogin();

    await submit();

    expect(await screen.findByText("Password is Required")).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("rejects passwords without mixed case or minimum length", async () => {
    renderLogin();

    await fillCredentials("user@example.com", "weak");
    await submit();

    expect(
      await screen.findByText(/Password must include at least one uppercase/i),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    renderLogin();
    const password = screen.getByPlaceholderText("Your Password");
    const [toggle] = screen.getAllByRole("button", { name: "" });

    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    expect(password).toHaveAttribute("type", "text");
    await userEvent.click(toggle);
    expect(password).toHaveAttribute("type", "password");
  });

  it("signs the user in and redirects to the requested page", async () => {
    renderLogin();

    await fillCredentials("user@example.com", "Secret1");
    await submit();

    await waitFor(() =>
      expect(loginUser).toHaveBeenCalledWith("user@example.com", "Secret1"),
    );
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Login Successful! Welcome Back Araf",
      ),
    );
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("surfaces firebase errors without navigating away", async () => {
    loginUser.mockRejectedValue(new Error("wrong password"));
    renderLogin();

    await fillCredentials("user@example.com", "Secret1");
    await submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("wrong password"),
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
