import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { track } from "@vercel/analytics";
import { describe, expect, it, vi } from "vitest";
import { ResumeDownloadLink } from "@/components/composites/ResumeDownloadLink";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("ResumeDownloadLink", () => {
  it("links to /resume as a download", () => {
    render(<ResumeDownloadLink />);
    const link = screen.getByRole("link", { name: "Download résumé" });
    expect(link).toHaveAttribute("href", "/resume");
    expect(link).toHaveAttribute("download");
  });

  it("tracks the click and lets the navigation proceed", async () => {
    render(<ResumeDownloadLink />);
    const link = screen.getByRole("link", { name: "Download résumé" });

    // Runs after the component's handler; cancelling here keeps jsdom from navigating.
    let prevented: boolean | null = null;
    window.addEventListener(
      "click",
      (event) => {
        prevented = event.defaultPrevented;
        event.preventDefault();
      },
      { once: true },
    );

    await userEvent.click(link);
    expect(track).toHaveBeenCalledWith("resume_download");
    expect(prevented).toBe(false);
  });
});
