const github = require('@actions/github');

const message = github.context.payload.head_commit.message;
const repoName = github.context.payload.repository.name;
const latestRelease = process.env.LATEST_RELEASE;
console.log(github.context);
const issueIdRegex = /[[]([a-zA-z])+[-]([0-9])+[\]]/;

function extractSubstring(str) {
  var rx = issueIdRegex;
  var arr = rx.exec(str);
  return arr[0]; 
}

function getNextReleaseTag(currentRelease) {
  const splitRelease = currentRelease.split('.');
  // rollover after x.99.0
  if (splitRelease[1] < 99) {
    return `${splitRelease[0]}.${parseInt(splitRelease[1]) + 1}.0`
  }
  return `${parseInt(splitRelease[0]) + 1}.0.0`
}

const issueId = extractSubstring(message);
const fixVersion = `${repoName}_${getNextReleaseTag(latestRelease)}`;

console.log({ issueId, fixVersion });

