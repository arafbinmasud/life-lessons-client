import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/utils";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders the 404 message with a link back home", () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Not Found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toHaveAttribute("href", "/");
  });
});
