import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatInterface } from "./chat-interface";

// Mock fetch
global.fetch = vi.fn();

// Mock child components
vi.mock("./omnibox", () => ({
  Omnibox: () => <div data-testid="omnibox">Omnibox</div>,
}));

vi.mock("./citation-sidebar", () => ({
  CitationSidebar: () => (
    <div data-testid="citation-sidebar">CitationSidebar</div>
  ),
}));

vi.mock("./model-switcher", () => ({
  ModelSwitcher: ({ selected }: { selected: string }) => (
    <div data-testid="model-switcher">Model: {selected}</div>
  ),
}));

vi.mock("./context-map", () => ({
  ContextMap: () => <div data-testid="context-map">Context Map</div>,
}));

vi.mock("./action-buttons", () => ({
  ActionButtons: () => <div data-testid="action-buttons">Action Buttons</div>,
}));

vi.mock("./chat-message", () => ({
  ChatMessage: ({ message }: { message: { content: string } }) => (
    <div data-testid="chat-message">{message.content}</div>
  ),
}));

describe("ChatInterface", () => {
  it("renders the chat interface", () => {
    render(<ChatInterface />);

    expect(screen.getByPlaceholderText(/Ask anything/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("renders welcome message when no messages", () => {
    render(<ChatInterface />);

    expect(screen.getByText("Welcome to Corporate Brain")).toBeInTheDocument();
    expect(
      screen.getByText("Ask anything about your company knowledge"),
    ).toBeInTheDocument();
  });

  it("renders Corporate Brain header", () => {
    render(<ChatInterface />);

    expect(screen.getByText("Corporate Brain")).toBeInTheDocument();
  });

  it("renders Context sidebar", () => {
    render(<ChatInterface />);

    expect(screen.getByText("Context")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Sources")).toBeInTheDocument();
  });

  it("renders child components", () => {
    render(<ChatInterface />);

    expect(screen.getByTestId("omnibox")).toBeInTheDocument();
    expect(screen.getByTestId("citation-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("model-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
  });

  it("has context map toggle button", () => {
    render(<ChatInterface />);

    expect(screen.getByText("Show Context Map")).toBeInTheDocument();
  });
});
