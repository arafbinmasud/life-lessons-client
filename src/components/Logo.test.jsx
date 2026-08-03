import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Logo from "./Logo";

describe("Logo", () => {
  it("renders the brand image with an accessible name", () => {
    render(<Logo />);

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", expect.stringContaining("logo"));
  });
});
