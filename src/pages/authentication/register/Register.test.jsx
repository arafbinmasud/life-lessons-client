import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";
import { makeAuthValue, renderWithProviders } from "../../../test/utils";
import Register from "./Register";

const navigate = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));
vi.mock("../../../hooks/useAxios");
vi.mock("../social/Social", () => ({
  default: () => <button type="button">Continue with Google</button>,
}));

const fillForm = async ({ password = "Secret1" } = {}) => {
  await userEvent.type(screen.getByPlaceholderText("Your Name"), "Araf");
  await userEvent.type(
    screen.getByPlaceholderText("Your Email"),
    "user@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText("Your PhotoURL"),
    "https://example.com/araf.png",
  );
  await userEvent.type(screen.getByPlaceholderText("Your Password"), password);
};

const submit = () =>
  userEvent.click(screen.getByRole("button", { name: "Register" }));

describe("Register", () => {
  const post = vi.fn();
  let registerUser;
  let updateUser;

  beforeEach(() => {
    post.mockResolvedValue({ data: { insertedId: "user-1" } });
    useAxios.mockReturnValue({ post });
    registerUser = vi.fn(() =>
      Promise.resolve({ user: { accessToken: "token-abc" } }),
    );
    updateUser = vi.fn(() => Promise.resolve());
  });

  const renderRegister = () =>
    renderWithProviders(<Register />, {
      auth: makeAuthValue({ registerUser, updateUser }),
    });

  it("links existing users to the login page", () => {
    renderRegister();

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/authentication/login",
    );
  });

  it("requires a name and a password", async () => {
    renderRegister();

    await submit();

    expect(await screen.findByText("Name is Required")).toBeInTheDocument();
    expect(screen.getByText("Password is Required")).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("enforces the password strength pattern", async () => {
    renderRegister();

    await fillForm({ password: "weak" });
    await submit();

    expect(
      await screen.findByText(/Password must include at least one uppercase/i),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    renderRegister();
    const password = screen.getByPlaceholderText("Your Password");
    const [toggle] = screen.getAllByRole("button", { name: "" });

    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    expect(password).toHaveAttribute("type", "text");
  });

  it("creates the firebase account, syncs the profile and stores the user", async () => {
    renderRegister();

    await fillForm();
    await submit();

    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith("user@example.com", "Secret1"),
    );
    expect(updateUser).toHaveBeenCalledWith({
      displayName: "Araf",
      photoURL: "https://example.com/araf.png",
    });
    expect(navigate).toHaveBeenCalledWith("/");
    await waitFor(() =>
      expect(post).toHaveBeenCalledWith(
        "/users",
        {
          displayName: "Araf",
          email: "user@example.com",
          photoURL: "https://example.com/araf.png",
          role: "user",
          isPremiumUser: false,
        },
        { headers: { Authorization: "Bearer token-abc" } },
      ),
    );
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Hi Araf, Welcome to Digital Life Lessons",
      ),
    );
  });

  it("skips the welcome toast when the user was not stored", async () => {
    post.mockResolvedValue({ data: {} });
    renderRegister();

    await fillForm();
    await submit();

    await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("reports firebase registration failures", async () => {
    registerUser.mockRejectedValue(new Error("email already in use"));
    renderRegister();

    await fillForm();
    await submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("email already in use"),
    );
    expect(post).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
