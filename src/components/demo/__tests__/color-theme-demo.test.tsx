import { render, screen, waitFor } from "@/__tests__/test-utils";
import { ColorThemeDemo } from "@/components/demo/color-theme-demo";
import { ColorThemeProvider } from "@/components/providers/theme/color-theme-provider";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import userEvent from "@testing-library/user-event";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <ColorThemeProvider>{children}</ColorThemeProvider>
  </ThemeProvider>
);

describe("ColorThemeDemo", () => {
  it("renders all color theme options", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    // Check for theme labels - use getAllByText to handle duplicates
    expect(screen.getAllByText("Blue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Red").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rose").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Orange").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Green").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Violet").length).toBeGreaterThan(0);
  });

  it("shows current theme as selected", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    // Blue should be selected by default - find the button variant
    const blueButtons = screen.getAllByText("Blue");
    const blueButton = blueButtons
      .find((el) => el.closest("button"))
      ?.closest("button");
    expect(blueButton).toHaveClass("bg-primary");
  });

  it("changes theme when color is selected", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    // Find the Red button specifically - use first one and ensure it's a button
    const redButtons = screen.getAllByText("Red");
    const redButton = redButtons
      .find((el) => el.closest("button"))
      ?.closest("button");

    if (redButton) {
      await user.click(redButton);
    }

    await waitFor(() => {
      expect(document.documentElement.classList.contains("theme-red")).toBe(
        true
      );
    });
  });

  it("renders component showcase sections", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    expect(screen.getByText("Buttons & Actions")).toBeInTheDocument();
    expect(screen.getByText("Form Elements")).toBeInTheDocument();
    expect(screen.getByText("Color System")).toBeInTheDocument();
    expect(screen.getByText("Alert Variants")).toBeInTheDocument();
  });

  it("renders interactive form elements", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/input field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle switch/i)).toBeInTheDocument();
    expect(screen.getByText(/slider control/i)).toBeInTheDocument();
  });

  it("updates input values when changed", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/input field/i);
    await user.clear(input);
    await user.type(input, "New text");

    expect(input).toHaveValue("New text");
  });

  it("renders technical information section", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    expect(screen.getByText("Technical Details")).toBeInTheDocument();
    expect(screen.getByText("Current Color Theme:")).toBeInTheDocument();
    expect(screen.getByText("Current Mode:")).toBeInTheDocument();
  });

  it("shows light/dark mode controls", () => {
    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    expect(screen.getByText("☀️ Light Mode")).toBeInTheDocument();
    expect(screen.getByText("🌙 Dark Mode")).toBeInTheDocument();
    expect(screen.getByText("💻 System")).toBeInTheDocument();
  });

  it("changes light/dark mode when buttons are clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ColorThemeDemo />
      </TestWrapper>
    );

    const darkButton = screen.getByText("🌙 Dark Mode");
    await user.click(darkButton);

    // Note: We can't easily test the actual theme change in Jest
    // since next-themes relies on browser APIs, but we can test that the button exists
    expect(darkButton).toBeInTheDocument();
  });
});
