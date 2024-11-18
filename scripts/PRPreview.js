import { execSync } from 'child_process'

console.log('[DEPLOY_PREVIEW]: START');
const command = 'npm run deploy:staging';
const output = execSync(command, { encoding: 'utf-8' });
const outputLines = output.split('\n');
// the last line of the build is Vercel's deploy preview url
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log('[DEPLOY_PREVIEW]: END')
console.log(`You can check the deploy preview on ${DEPLOY_URL}`);

// use GitHub API to post a comment in the PR
console.log("[GITHUB_COMMENT]: START");
// some env variables are available from actions/checkout@v3 (ci.yml)
const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_PR_NUMBER } = process.env;
const GH_COMMENT = `
- Deploy URL: [${DEPLOY_URL}](${DEPLOY_URL})
`;

const defaultHeaders = {};
defaultHeaders["authorization"] = `token ${GITHUB_TOKEN}`;
defaultHeaders["accept"] =
  "application/vnd.github.v3+json; application/vnd.github.antiope-preview+json";
defaultHeaders["content-type"] = "application/json";

console.log("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);

// posting the comment
fetch(
  `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
  {
    headers: defaultHeaders,
    method: "POST",
    body: JSON.stringify({
      body: GH_COMMENT,
    }),
  }
)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .catch((err) => {
    console.log("[GITHUB_COMMENT]: ERROR");
    throw new Error(err);
  })
  .finally(() => {
    console.log("[GITHUB_COMMENT]: END]");
  });