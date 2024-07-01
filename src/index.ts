import * as core from "@actions/core";
import * as inputs from "./inputs.js";
import * as octokit from "@octokit/rest";
import * as outputs from "./outputs.js";
import sourceMapSupport from "source-map-support";

function getRepository() {
	const repository = inputs.get().repository.split("/");
	return {repositoryOwner: repository[0], repositoryName: repository[1]};
}

async function createOrUpdateIssue():Promise<number> {
	const githubClient = new octokit.Octokit({auth: inputs.get().token});
	const {repositoryOwner, repositoryName} = getRepository();

	const issues = await githubClient.paginate(githubClient.rest.issues.listForRepo, {
		owner: repositoryOwner,
		repo: repositoryName,
	});
	const matchingIssues = issues.filter(issue => issue.pull_request === undefined && issue.title === inputs.get().title);
	if (matchingIssues.length > 0) {
		core.info(`Found existing issue ${matchingIssues[0].number}.`);
		const assignees = !inputs.get().close ? inputs.get().assignees : undefined;
		githubClient.issues.update({
			owner: repositoryOwner,
			repo: repositoryName,
			issue_number: matchingIssues[0].number,
			body: inputs.get().body,
			assignees: assignees,
			state: inputs.get().close ? "closed" : "open",
		});
		return matchingIssues[0].number;
	}

	if (inputs.get().close) {
		core.info("No issue found to close.");
		return 0;
	}

	const createdIssue = await githubClient.issues.create({
		owner: repositoryOwner,
		repo: repositoryName,
		title: inputs.get().title,
		body: inputs.get().body,
		assignees: inputs.get().assignees,
	});
	core.info(`Created issue ${createdIssue.data.number}.`);
	return createdIssue.data.number;
}

async function main() {
	sourceMapSupport.install();
	outputs.set({"issue-number": await createOrUpdateIssue()});
}

main().catch(error => core.setFailed(error.stack || error));
