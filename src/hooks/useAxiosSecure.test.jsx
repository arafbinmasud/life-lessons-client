import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const navigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigate,
}));
vi.mock("./useAuth");

const activeHandlers = (manager) => manager.handlers.filter(Boolean);

describe("useAxiosSecure", () => {
  const logoutUser = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { accessToken: "token-123" },
      logoutUser,
    });
  });

  it("attaches the user access token to outgoing requests", () => {
    const { result } = renderHook(() => useAxiosSecure());
    const [requestHandler] = activeHandlers(
      result.current.interceptors.request,
    );

    const config = requestHandler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer token-123");
  });

  it("sends an undefined token when no user is signed in", () => {
    useAuth.mockReturnValue({ user: null, logoutUser });
    const { result } = renderHook(() => useAxiosSecure());
    const [requestHandler] = activeHandlers(
      result.current.interceptors.request,
    );

    const config = requestHandler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer undefined");
  });

  it("passes successful responses through untouched", () => {
    const { result } = renderHook(() => useAxiosSecure());
    const [responseHandler] = activeHandlers(
      result.current.interceptors.response,
    );
    const response = { data: { ok: true } };

    expect(responseHandler.fulfilled(response)).toBe(response);
  });

  it.each([401, 403])(
    "logs the user out and redirects to login on %i responses",
    async (status) => {
      const { result } = renderHook(() => useAxiosSecure());
      const [responseHandler] = activeHandlers(
        result.current.interceptors.response,
      );
      const error = { status };

      await expect(responseHandler.rejected(error)).rejects.toBe(error);
      expect(logoutUser).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/authentication/login");
    },
  );

  it("keeps the session for other error statuses", async () => {
    const { result } = renderHook(() => useAxiosSecure());
    const [responseHandler] = activeHandlers(
      result.current.interceptors.response,
    );
    const error = { status: 500 };

    await expect(responseHandler.rejected(error)).rejects.toBe(error);
    expect(logoutUser).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("ejects both interceptors on unmount", () => {
    const { result, unmount } = renderHook(() => useAxiosSecure());
    const instance = result.current;
    expect(activeHandlers(instance.interceptors.request)).toHaveLength(1);

    unmount();

    expect(activeHandlers(instance.interceptors.request)).toHaveLength(0);
    expect(activeHandlers(instance.interceptors.response)).toHaveLength(0);
  });
});
