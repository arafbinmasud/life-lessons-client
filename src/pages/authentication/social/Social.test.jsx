import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";
import { makeAuthValue, renderWithProviders } from "../../../test/utils";
import Social from "./Social";

const navigate = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));
vi.mock("../../../hooks/useAxios");

const googleUser = {
  accessToken: "token-abc",
  displayName: "Araf",
  email: "user@example.com",
  photoURL: "https://example.com/araf.png",
};

const clickGoogle = () =>
  userEvent.click(screen.getByRole("button", { name: /continue with google/i }));

describe("Social", () => {
  const post = vi.fn();
  let googleSignIn;

  beforeEach(() => {
    post.mockResolvedValue({ data: { insertedId: "user-1" } });
    useAxios.mockReturnValue({ post });
    googleSignIn = vi.fn(() => Promise.resolve({ user: googleUser }));
  });

  const renderSocial = () =>
    renderWithProviders(<Social />, { auth: makeAuthValue({ googleSignIn }) });

  it("persists a new google user with the bearer token and welcomes them", async () => {
    renderSocial();

    await clickGoogle();

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith(
        "/users",
        {
          displayName: "Araf",
          email: "user@example.com",
          photoURL: googleUser.photoURL,
          role: "user",
          isPremiumUser: false,
        },
        { headers: { Authorization: "Bearer token-abc" } },
      ),
    );
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Hi Araf , Welcome to Digital Life Lessons",
      ),
    );
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("welcomes returning users reported as already existing", async () => {
    post.mockResolvedValue({ data: { message: "User Exists" } });
    renderSocial();

    await clickGoogle();

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
  });

  it("still navigates when the user record could not be stored", async () => {
    post.mockResolvedValue({ data: {} });
    renderSocial();

    await clickGoogle();

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/"));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("reports google sign-in failures", async () => {
    googleSignIn.mockRejectedValue(new Error("popup closed"));
    renderSocial();

    await clickGoogle();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("popup closed"),
    );
    expect(post).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
