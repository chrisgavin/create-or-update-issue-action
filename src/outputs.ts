import * as core from "@actions/core";

export class Outputs {
	"issue-number":number;
}

export function set(outputs:Partial<Outputs>):void {
	for (const [key, value] of Object.entries(outputs)) {
		core.setOutput(key, value);
	}
}
