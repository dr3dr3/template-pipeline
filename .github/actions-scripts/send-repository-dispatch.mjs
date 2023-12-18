#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function sendRepoDispatch() {

    try {
        const { data:status } = await octokit.rest.repos.createDispatchEvent({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            event_type: 'deploy'
        });
        console.log( 'createDispatchEvent: ' + status );
        return true;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await sendRepoDispatch();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=template-deployment node .github/actions-scripts/send-repository-dispatch.mjs
*/