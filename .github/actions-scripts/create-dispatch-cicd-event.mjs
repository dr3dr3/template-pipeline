#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.EVENT_TYPE, "EVENT_TYPE not present");
console.assert(process.env.PHASE, "PHASE not present");
console.assert(process.env.OUTCOME, "OUTCOME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function createDispatch() {
    const { status:dispatchEvent } = await octokit.rest.repos.createDispatchEvent({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        event_type: process.env.EVENT_TYPE,
        client_payload: { "phase": process.env.PHASE, "outcome": process.env.OUTCOME }
    });
    console.log( dispatchEvent );
    return true;
}

async function main() {
    const result = await createDispatch();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=template-gitops EVENT_TYPE=cicd-event PHASE=start OUTCOME=success node .github/actions-scripts/create-dispatch-cicd-event.mjs
*/