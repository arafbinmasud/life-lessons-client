import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Container from "./Container";

describe("Container", () => {
  it("wraps its children in the shared max-width layout", () => {
    const { container } = render(
      <Container>
        <p>page content</p>
      </Container>,
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("max-w-350", "mx-auto", "w-full");
  });
});
