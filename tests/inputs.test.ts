import * as core from "@actions/core";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@actions/core");

describe("test get().assignees", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should be the split assignees", async () => {
		vi.mocked(core.getInput).mockImplementation((input: string) => {
			if (input === "assignees") {
				return "mona,lisa";
			}
			return "";
		});

		const inputs = await import("../src/inputs");
		expect(inputs.get().assignees).toEqual(["mona", "lisa"]);
	});
});
