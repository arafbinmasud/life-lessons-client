import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { makeAuthValue, renderWithProviders } from "../../test/utils";
import PaymentSuccess from "./PaymentSuccess";

vi.mock("../../hooks/useAxiosSecure");
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

const auth = makeAuthValue({ user: { email: "user@example.com" } });

describe("PaymentSuccess", () => {
  const patch = vi.fn();

  beforeEach(() => {
    patch.mockResolvedValue({ data: { modifiedCount: 1 } });
    useAxiosSecure.mockReturnValue({ patch });
  });

  it("upgrades the account for the checkout session and confirms it", async () => {
    renderWithProviders(<PaymentSuccess />, {
      auth,
      route: "/payment-success?session_id=cs_test_123",
    });

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith("/users/upgrade/user@example.com", {
        sessionId: "cs_test_123",
      }),
    );
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: "success" }),
      ),
    );
    expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /go to dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });

  it("skips the confirmation dialog when nothing was modified", async () => {
    patch.mockResolvedValue({ data: { modifiedCount: 0 } });

    renderWithProviders(<PaymentSuccess />, {
      auth,
      route: "/payment-success?session_id=cs_test_123",
    });

    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it("does not upgrade without a session id in the url", () => {
    renderWithProviders(<PaymentSuccess />, { auth, route: "/payment-success" });

    expect(patch).not.toHaveBeenCalled();
  });

  it("does not upgrade before the user is known", () => {
    renderWithProviders(<PaymentSuccess />, {
      auth: makeAuthValue({ user: null }),
      route: "/payment-success?session_id=cs_test_123",
    });

    expect(patch).not.toHaveBeenCalled();
  });

  it("swallows upgrade failures and still renders the page", async () => {
    patch.mockRejectedValue(new Error("upgrade failed"));

    renderWithProviders(<PaymentSuccess />, {
      auth,
      route: "/payment-success?session_id=cs_test_123",
    });

    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
  });
});
