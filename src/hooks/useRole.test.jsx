import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestQueryClient } from "../test/utils";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import useRole from "./useRole";

vi.mock("./useAuth");
vi.mock("./useAxiosSecure");

describe("useRole", () => {
  const get = vi.fn();

  const renderUseRole = () => {
    const queryClient = createTestQueryClient();
    return renderHook(() => useRole(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
  };

  beforeEach(() => {
    useAxiosSecure.mockReturnValue({ get });
    useAuth.mockReturnValue({
      user: { email: "user@example.com" },
      loading: false,
    });
  });

  it("returns the role and premium flag from the users endpoint", async () => {
    get.mockResolvedValue({ data: { role: "admin", isPremiumUser: true } });

    const { result } = renderUseRole();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(get).toHaveBeenCalledWith("/users?email=user@example.com");
    expect(result.current.role).toBe("admin");
    expect(result.current.isPremiumUser).toBe(true);
  });

  it("falls back to a non-premium 'user' role when the response omits them", async () => {
    get.mockResolvedValue({ data: {} });

    const { result } = renderUseRole();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe("user");
    expect(result.current.isPremiumUser).toBe(false);
  });

  it("stays loading and skips the request while auth is resolving", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    const { result } = renderUseRole();

    expect(get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
    expect(result.current.role).toBe("user");
  });

  it("does not query when the signed-in user has no email", () => {
    useAuth.mockReturnValue({ user: {}, loading: false });

    const { result } = renderUseRole();

    expect(get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
