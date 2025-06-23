import { render, screen, fireEvent } from "@testing-library/react";
import ChatWindow from "../ChatWindow";
import { describe, it, expect } from "vitest";

// simple mock of useChat
vi.mock("@/lib/useChat", () => ({
  useChat: () => ({ messages: [], send: vi.fn() })
}));

describe("ChatWindow", () => {
  it("renders input", () => {
    render(<ChatWindow />);
    expect(screen.getByPlaceholderText(/Ask GreenDev/i)).toBeInTheDocument();
  });
});
