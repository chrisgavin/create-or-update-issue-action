"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const inputs = __importStar(require("./inputs"));
const octokit = __importStar(require("@octokit/rest"));
const outputs = __importStar(require("./outputs"));
const source_map_support_1 = __importDefault(require("source-map-support"));
function getRepository() {
    const repository = inputs.get().repository.split("/");
    return { repositoryOwner: repository[0], repositoryName: repository[1] };
}
async function createOrUpdateIssue() {
    const githubClient = new octokit.Octokit({ auth: inputs.get().token });
    const { repositoryOwner, repositoryName } = getRepository();
    const issues = await githubClient.paginate(githubClient.rest.issues.listForRepo, {
        owner: repositoryOwner,
        repo: repositoryName,
    });
    const matchingIssues = issues.filter(issue => issue.pull_request === undefined && issue.title === inputs.get().title);
    if (matchingIssues.length > 0) {
        core.info(`Found existing issue ${matchingIssues[0].number}.`);
        githubClient.issues.update({
            owner: repositoryOwner,
            repo: repositoryName,
            issue_number: matchingIssues[0].number,
            body: inputs.get().body,
            assignees: inputs.get().assignees,
        });
        return matchingIssues[0].number;
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
    source_map_support_1.default.install();
    outputs.set({ "issue-number": await createOrUpdateIssue() });
}
main().catch(error => core.setFailed(error.stack || error));
//# sourceMappingURL=index.js.map