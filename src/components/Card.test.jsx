import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useRole from "../hooks/useRole";
import { renderWithProviders } from "../test/utils";
import Card from "./Card";

vi.mock("../hooks/useRole");

const lesson = {
  _id: "lesson-1",
  title: "Patience pays off",
  description: "A long story about patience.",
  category: "Career",
  tone: "Reflective",
  accessLevel: "Free",
  image: "https://example.com/lesson.png",
  authorName: "Araf",
  authorPhoto: "https://example.com/araf.png",
  createdAt: "2026-01-15T10:30:00.000Z",
};

describe("Card", () => {
  beforeEach(() => {
    useRole.mockReturnValue({ isPremiumUser: false, loading: false });
  });

  it("shows a loader while the role is being resolved", () => {
    useRole.mockReturnValue({ isPremiumUser: false, loading: true });

    const { container } = renderWithProviders(<Card lesson={lesson} />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText(lesson.title)).not.toBeInTheDocument();
  });

  it("renders the lesson metadata, author and details link", () => {
    renderWithProviders(<Card lesson={lesson} />);

    expect(screen.getByText("Patience pays off")).toBeInTheDocument();
    expect(screen.getByText("A long story about patience.")).toBeInTheDocument();
    expect(screen.getByText("Career")).toBeInTheDocument();
    expect(screen.getByText("Reflective")).toBeInTheDocument();
    expect(screen.getByText("Araf")).toBeInTheDocument();
    expect(screen.getByAltText(lesson.title)).toHaveAttribute(
      "src",
      lesson.image,
    );
    expect(screen.getByRole("link", { name: /see details/i })).toHaveAttribute(
      "href",
      "/lesson-details/lesson-1",
    );
  });

  it("formats the creation date for display", () => {
    renderWithProviders(<Card lesson={lesson} />);

    expect(screen.getByText(/Posted At:/)).toHaveTextContent(
      new Date(lesson.createdAt).toLocaleString("en-Gb", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
  });

  it("falls back to a placeholder when the lesson has no image", () => {
    renderWithProviders(<Card lesson={{ ...lesson, image: "" }} />);

    expect(screen.getByText("No Image")).toBeInTheDocument();
    expect(screen.queryByAltText(lesson.title)).not.toBeInTheDocument();
  });

  it("locks premium lessons for non-premium users", () => {
    renderWithProviders(
      <Card lesson={{ ...lesson, accessLevel: "Premium" }} />,
    );

    expect(screen.getByText("Premium Lesson")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /upgrade to view/i }),
    ).toHaveAttribute("href", "/upgrade-plan");
  });

  it("unlocks premium lessons for premium users", () => {
    useRole.mockReturnValue({ isPremiumUser: true, loading: false });

    renderWithProviders(
      <Card lesson={{ ...lesson, accessLevel: "Premium" }} />,
    );

    expect(screen.queryByText("Premium Lesson")).not.toBeInTheDocument();
  });
});
