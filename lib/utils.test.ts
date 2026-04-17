import { describe, it, expect } from "vitest";
import { cn, formatDate, truncateText, formatFileSize, sleep } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("merges tailwind classes", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles array inputs", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });
});

describe("formatDate", () => {
  it("returns correct string for valid date", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("January 15, 2024");
  });

  it("handles string date input", () => {
    expect(formatDate("2024-01-15")).toBe("January 15, 2024");
  });

  it("handles invalid date gracefully", () => {
    expect(formatDate("invalid")).toBe("Invalid date");
  });

  it("handles null input", () => {
    expect(formatDate(null as unknown as string)).toBe("Invalid date");
  });
});

describe("truncateText", () => {
  it("cuts at limit with ellipsis", () => {
    const text = "This is a very long text that needs truncation";
    // limit 20 - suffix length 3 = 17 chars from original text
    expect(truncateText(text, 20)).toBe("This is a very lo...");
  });

  it("does not truncate short text", () => {
    const text = "Short";
    expect(truncateText(text, 10)).toBe("Short");
  });

  it("handles exact length text", () => {
    const text = "Exactly ten";
    expect(truncateText(text, 11)).toBe("Exactly ten");
  });

  it("handles empty string", () => {
    expect(truncateText("", 10)).toBe("");
  });

  it("uses custom suffix", () => {
    const text = "This is a very long text";
    // limit 10 - suffix length 7 = 3 chars from original text
    expect(truncateText(text, 10, "...more")).toBe("Thi...more");
  });
});

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
  });

  it("formats with decimals", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("handles zero", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });
});

describe("sleep", () => {
  it("delays execution", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(90);
  });

  it("resolves after delay", async () => {
    const result = await sleep(50);
    expect(result).toBeUndefined();
  });
});
