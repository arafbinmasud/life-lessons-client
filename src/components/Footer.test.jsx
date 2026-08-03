import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/utils";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the brand, contact details and social links", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText("Digital Life Lessons")).toBeInTheDocument();
    expect(
      screen.getByText("Email: digital.life@lessons.com"),
    ).toBeInTheDocument();
    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
    expect(screen.getByText("Social")).toBeInTheDocument();
  });
});
