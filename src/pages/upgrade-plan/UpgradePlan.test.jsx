import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useRole from "../../hooks/useRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { makeAuthValue, renderWithProviders } from "../../test/utils";
import UpgradePlan from "./UpgradePlan";

vi.mock("../../hooks/useRole");
vi.mock("../../hooks/useAxiosSecure");

const auth = makeAuthValue({ user: { email: "user@example.com" } });

describe("UpgradePlan", () => {
  const post = vi.fn();

  beforeEach(() => {
    post.mockResolvedValue({ data: { url: "https://stripe.test/checkout" } });
    useAxiosSecure.mockReturnValue({ post });
    useRole.mockReturnValue({ isPremiumUser: false, loading: false });
  });

  it("shows a loader while the role is being resolved", () => {
    useRole.mockReturnValue({ isPremiumUser: false, loading: true });

    const { container } = renderWithProviders(<UpgradePlan />, { auth });

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Upgrade to Premium Plan")).not.toBeInTheDocument();
  });

  it("congratulates users who already have premium instead of selling again", () => {
    useRole.mockReturnValue({ isPremiumUser: true, loading: false });

    renderWithProviders(<UpgradePlan />, { auth });

    expect(screen.getByText("You are a Premium Member!")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /choose premium plan/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the plan comparison table for free users", () => {
    renderWithProviders(<UpgradePlan />, { auth });

    expect(screen.getByText("Upgrade to Premium Plan")).toBeInTheDocument();
    expect(screen.getByText("Daily Lesson Creation")).toBeInTheDocument();
    expect(screen.getByText("Up to 3")).toBeInTheDocument();
    expect(screen.getByText("Unlimited")).toBeInTheDocument();
    expect(screen.getByText("Export Lessons as PDF")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /current plan/i })).toBeDisabled();
  });

  it("redirects to the stripe checkout session created for the user", async () => {
    const { location } = window;
    delete window.location;
    window.location = { href: "" };

    try {
      renderWithProviders(<UpgradePlan />, { auth });

      await userEvent.click(
        screen.getByRole("button", { name: /choose premium plan/i }),
      );

      expect(post).toHaveBeenCalledWith("/payment-checkout-session", {
        price: 1500,
        userEmail: "user@example.com",
      });
      expect(window.location.href).toBe("https://stripe.test/checkout");
    } finally {
      window.location = location;
    }
  });

  it("stays on the page when checkout session creation fails", async () => {
    post.mockRejectedValue(new Error("stripe down"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<UpgradePlan />, { auth });

    await userEvent.click(
      screen.getByRole("button", { name: /choose premium plan/i }),
    );

    expect(consoleError).toHaveBeenCalled();
    expect(screen.getByText("Upgrade to Premium Plan")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
