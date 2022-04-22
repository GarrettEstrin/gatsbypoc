const github = require('@actions/github');
const request = require('request');

const message = github.context.payload.head_commit.message;
const repoName = github.context.payload.repository.name;
const latestRelease = process.env.LATEST_RELEASE;
const auth = process.env.AUTH;
const projectId = process.env.PROJECT_ID;
const issueIdRegex = /[[]([a-zA-z])+[-]([0-9])+[\]]/;
console.log(latestRelease);
function extractSubstring(str) {
  const rx = issueIdRegex;
  const arr = rx.exec(str);
  return arr[0].replace('[', '').replace(']', ''); 
}

function getNextReleaseTag(currentRelease) {
  const splitRelease = currentRelease.split('.');
  // rollover after x.99.0
  if (splitRelease[1] < 99) {
    return `${splitRelease[0]}.${parseInt(splitRelease[1]) + 1}.0`
  }
  return `${parseInt(splitRelease[0]) + 1}.0.0`
}

function addFixVersionToIssue() {
  var options = {
    'method': 'PUT',
    'url': `https://kgedev.atlassian.net/rest/api/3/issue/${issueId}`,
    'headers': {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${auth}`,
    },
    body: `{"update": {"fixVersions": [{"add": {"name": "${fixVersion}"}}]}}`

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

function createFixVersion() {
  var options = {
    'method': 'POST',
    'url': 'https://kgedev.atlassian.net/rest/api/3/version',
    'headers': {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${auth}`
    },
    body: `{"name": "${fixVersion}", "projectId": ${projectId}}`

  };
  request(options, function (error, response) {
    addFixVersionToIssue();
  });
}

const issueId = extractSubstring(message);
const fixVersion = `${repoName}_${getNextReleaseTag(latestRelease)}`;

createFixVersion();



