import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/utils";
import PaymentCancel from "./PaymentCancel";

describe("PaymentCancel", () => {
  it("explains the cancellation and offers retry and home links", () => {
    renderWithProviders(<PaymentCancel />);

    expect(screen.getByText("Payment Cancelled")).toBeInTheDocument();
    expect(
      screen.getByText(/your\s+account status remains unchanged/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /try again/i })).toHaveAttribute(
      "href",
      "/upgrade-plan",
    );
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toHaveAttribute("href", "/");
  });
});
