import * as inputs from "../src/inputs";
import * as core from "@actions/core";
import { describe, it, expect, vi } from "vitest";

describe("test get().assignees", () => {
	it("should be the split assignees", async () => {
		vi.spyOn(core, "getInput").mockImplementation((input:string) => {
			if (input === "assignees") {
				return "mona,lisa";
			}
			return "";
		});
		expect(inputs.get().assignees).toEqual(["mona", "lisa"]);
	});
});
