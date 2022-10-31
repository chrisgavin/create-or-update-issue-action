import * as core from "@actions/core";

export class Inputs {
	"repository" = core.getInput("repository", {required: true});
	"token" = core.getInput("token", {required: true});
	"title" = core.getInput("title", {required: true});
	"body"? = core.getInput("body", {required: false});
	"assignees"? = core.getInput("assignees", {required: false})?.split(",");
	"close"? = core.getInput("close", {required: false}) === "true";
}

export function get():Inputs {
	return new Inputs();
}
