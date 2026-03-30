import * as core from "@actions/core";
export class Outputs {
    "issue-number";
}
export function set(outputs) {
    for (const [key, value] of Object.entries(outputs)) {
        core.setOutput(key, value);
    }
}
//# sourceMappingURL=outputs.js.map