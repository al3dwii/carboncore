import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertBanner } from "../alerts/AlertBanner";

describe("<AlertBanner>", () => {
  it("hides banner when count = 0", () => {
    render(<AlertBanner count={0} />);
    expect(screen.queryByText(/unresolved/)).toBeNull();
  });

  it("shows count when > 0", () => {
    render(<AlertBanner count={3} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });
});
