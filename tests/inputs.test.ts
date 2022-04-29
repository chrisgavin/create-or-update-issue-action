import * as inputs from "../src/inputs";
import * as core from "@actions/core";

describe("test get().assignees", () => {
	it("should be the split assignees", async () => {
		jest.spyOn(core, "getInput").mockImplementation((input:string) => {
			if (input === "assignees") {
				return "mona,lisa";
			}
			return "";
		});
		expect(inputs.get().assignees).toEqual(["mona", "lisa"]);
	});
});
