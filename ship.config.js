const shell = require('shelljs');

const packages = JSON.parse(
  shell.exec('yarn run --silent lerna list --toposort --json --no-private', {
    silent: true,
  })
);

module.exports = {
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === 'patch' && fix === 0) {
      return false;
    }
    return true;
  },
  getTagName: () =>
    packages.map((package) => `${package.name}@${package.version}`),
  getStagingBranchName: () => `chore/release-${Date.now()}`,
  version({ exec }) {
    exec(
      'yarn lerna version --no-git-tag-version --no-push --exact --conventional-commits --yes'
    );

    return {
      // This is used for shouldPrepare
      nextVersion: packages[0].version,
    };
  },
  formatCommitMessage: () => `chore: release`,
  formatPullRequestTitle: () => `chore: release`,
  formatPullRequestMessage: ({
    repo,
    repoURL,
    stagingBranch,
    releaseType,
    publishCommands,
    title,
  }) => {
    const repoLink = `[${repo}](${repoURL})`;
    // this is assuming there's a single "previous" version, so can't be used with independent versioning.
    // const diffLink = `[\`${currentVersion}\` → \`${nextVersion}\`](${diffURL})`;
    const publishCommandsTable = `\`\`\`${publishCommands}\`\`\``;

    const mergeInstruction = `
When merging this pull request, you need to **Squash and merge** and make sure that the title starts with \`${title}\`.
<details>
<summary>See details</summary>

After that, a commit \`${title}\` will be added and you or your CI can run \`shipjs trigger\` to trigger the release based on the commit.
![Squash and merge](https://raw.githubusercontent.com/algolia/shipjs/v0.24.4/assets/squash-and-merge.png)
</details>
    `.trim();

    const message = `
This pull request prepares the following release:
| Repository | Branch | Update |
|---|---|---|
| ${repoLink} | ${stagingBranch} | ${releaseType} |

### Release Summary
This is going to be published with the following command:

${publishCommandsTable}

### Merging Instructions
${mergeInstruction}

---

_This pull request is automatically generated by [Ship.js](https://github.com/algolia/shipjs)_.
`.trim();
    return message;
  },
  pullRequestTeamReviewers: ['frontend-experiences-web'],
  buildCommand: () => 'NODE_ENV=production yarn build:ci',
  publishCommand: () => 'yarn lerna publish from-package --yes',
  beforeCommitChanges() {
    shell.exec('yarn run doctoc');
  },
  slack: {
    // disable slack notification for `prepared` lifecycle.
    // Ship.js will send slack message only for `releaseSuccess`.
    prepared: null,
    releaseSuccess: ({
      appName,
      version,
      tagName,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
    }) => ({
      pretext: [
        `:tada: Successfully released *${appName}@${version}*`,
        '',
        `Make sure to run \`yarn run release-templates\` in \`create-instantsearch-app\`.`,
      ].join('\n'),
      fields: [
        {
          title: 'Branch',
          value: 'master',
          short: true,
        },
        {
          title: 'Commit',
          value: `*<${latestCommitUrl}|${latestCommitHash}>*`,
          short: true,
        },
        {
          title: 'Version',
          value: version,
          short: true,
        },
        {
          title: 'Release',
          value: `${repoURL}/releases/tag/${tagName}`,
        },
      ],
    }),
  },
};
