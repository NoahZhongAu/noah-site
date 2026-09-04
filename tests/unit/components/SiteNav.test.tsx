import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteNav } from "@/components/composites/SiteNav";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const links = [
  { href: "#story", label: "Story" },
  { href: "#contact", label: "Contact" },
] as const;

function setup() {
  render(<SiteNav name="Noah Zhong" links={[...links]} />);
  const toggle = screen.getByRole("button", { name: "Open menu" });
  const panelId = toggle.getAttribute("aria-controls") ?? "";
  const panel = document.getElementById(panelId);
  if (!panel) throw new Error("aria-controls must point at the menu panel");
  return { toggle, panel };
}

describe("SiteNav hamburger", () => {
  it("starts closed and toggles aria-expanded on click", async () => {
    const { toggle, panel } = setup();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(panel).toBeVisible();
    expect(within(panel).getByRole("link", { name: "Story" })).toBeVisible();
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const { toggle } = setup();
    await userEvent.click(toggle);
    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes when a menu link is chosen", async () => {
    const { toggle, panel } = setup();
    await userEvent.click(toggle);
    await userEvent.click(within(panel).getByRole("link", { name: "Story" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a click outside the nav", async () => {
    const { toggle } = setup();
    await userEvent.click(toggle);
    await userEvent.click(document.body);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
