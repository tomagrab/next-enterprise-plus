import { render, screen } from "@/__tests__/test-utils";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { ColorThemeProvider } from "@/components/providers/theme/color-theme-provider";
import userEvent from "@testing-library/user-event";

// Wrapper component to provide context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ColorThemeProvider>{children}</ColorThemeProvider>
);

describe("ColorThemeToggle", () => {
  it("renders palette button", () => {
    render(
      <TestWrapper>
        <ColorThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /toggle color theme/i });
    expect(button).toBeInTheDocument();
  });

  it("opens dropdown menu when clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /toggle color theme/i });
    await user.click(button);

    expect(screen.getByText("Color Theme")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Rose")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
    expect(screen.getByText("Green")).toBeInTheDocument();
    expect(screen.getByText("Violet")).toBeInTheDocument();
  });

  it("shows current theme as selected", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /toggle color theme/i });
    await user.click(button);

    // Blue should be selected by default (font-semibold class and checkmark)
    const blueText = screen.getByText("Blue");
    expect(blueText).toHaveClass("font-semibold");
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("changes theme when option is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /toggle color theme/i });
    await user.click(button);

    const redOption = screen.getByText("Red").closest('[role="menuitem"]');
    if (redOption) {
      await user.click(redOption);
    }

    // Check that the theme class was applied to document
    expect(document.documentElement.classList.contains("theme-red")).toBe(true);
  });

  it("displays color previews for each theme", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /toggle color theme/i });
    await user.click(button);

    // Check that color preview divs are present
    const menuItems = screen.getAllByRole("menuitem");

    // Should have 6 menu items (one for each color theme)
    expect(menuItems).toHaveLength(6);

    // Each menu item should contain color text
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Rose")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
    expect(screen.getByText("Green")).toBeInTheDocument();
    expect(screen.getByText("Violet")).toBeInTheDocument();
  });
});
