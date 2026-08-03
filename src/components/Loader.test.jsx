import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loader from "./Loader";

describe("Loader", () => {
  it("renders a centered daisyUI spinner", () => {
    const { container } = render(<Loader />);

    expect(container.firstChild).toHaveClass("text-center");
    expect(container.querySelector("span")).toHaveClass(
      "loading",
      "loading-spinner",
      "loading-lg",
    );
  });
});
