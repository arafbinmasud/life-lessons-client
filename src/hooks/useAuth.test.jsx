import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthContext } from "../contexts/AuthContext";
import useAuth from "./useAuth";

describe("useAuth", () => {
  it("returns the value provided by AuthContext", () => {
    const authValue = { user: { email: "a@b.com" }, loading: false };
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext value={authValue}>{children}</AuthContext>
      ),
    });

    expect(result.current).toBe(authValue);
  });

  it("returns undefined when rendered without a provider", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeUndefined();
  });
});
