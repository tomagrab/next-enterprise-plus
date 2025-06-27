import { render, screen } from "@/__tests__/test-utils";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { suppressConsoleError } from "@/__tests__/test-utils";

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error fallback when there is an error", () => {
    suppressConsoleError(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });

  it("shows error details in test environment", () => {
    suppressConsoleError(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
    });

    // In test environment, we should see development details
    expect(screen.getByText("Development Error Details:")).toBeInTheDocument();
    // The error message should be in the pre element containing the stack trace
    const errorDetails = screen.getByText(/Test error/);
    expect(errorDetails).toBeInTheDocument();
    // Ensure it's in a pre element as expected
    expect(errorDetails.tagName).toBe("PRE");
  });

  it("renders custom fallback component when provided", () => {
    const CustomFallback = ({
      error,
    }: {
      error: Error;
      resetError: () => void;
    }) => <div>Custom error: {error.message}</div>;

    suppressConsoleError(() => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Custom error: Test error")).toBeInTheDocument();
  });
});
