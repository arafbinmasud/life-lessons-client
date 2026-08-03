import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useAxios from "./useAxios";

describe("useAxios", () => {
  it("returns an axios instance configured with the API base URL", () => {
    const { result } = renderHook(() => useAxios());

    expect(result.current.defaults.baseURL).toBe(
      "https://life-lesson-server-kohl.vercel.app",
    );
    expect(typeof result.current.get).toBe("function");
  });

  it("reuses the same instance across renders and hook calls", () => {
    const first = renderHook(() => useAxios());
    const second = renderHook(() => useAxios());

    expect(first.result.current).toBe(second.result.current);
  });
});
