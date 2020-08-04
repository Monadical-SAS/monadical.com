const utf8 = require('utf8');

// Adapted from https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0
const getLatestCommit = async (
  octo,
  org,
  repo,
  branch = 'master',
) => {
  const { data: refData } = await octo.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.object.sha;
  const { data: commitData } = await octo.git.getCommit({
    owner: org,
    repo,
    commit_sha: commitSha,
  });
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
};

const createBlobForString = (octo, org, repo) => async (
  contentString,
) => {
  let content;
  let { encoding } = contentString;

  if (contentString.utf8encode) {
    content = utf8.encode(contentString.data);
    encoding = 'utf-8';
  } else {
    content = contentString.data;
  }

  const blobData = await octo.git.createBlob({
    owner: org,
    repo,
    content,
    encoding,
  });
  return blobData.data;
};

const createNewTree = async (
  octo,
  owner,
  repo,
  blobs,
  paths,
  parentTreeSha,
) => {
  // My custom config. Could be taken as parameters
  const tree = blobs.map(({ sha }, index) => ({
    path: paths[index],
    mode: '100644',
    type: 'blob',
    sha,
  }));
  const { data } = await octo.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  });
  return data;
};

const createNewCommit = async (
  octo,
  org,
  repo,
  message,
  currentTreeSha,
  currentCommitSha,
) => (await octo.git.createCommit({
  owner: org,
  repo,
  message,
  tree: currentTreeSha,
  parents: [currentCommitSha],
})).data;

const setBranchToCommit = (
  octo,
  org,
  repo,
  commitSha,
  branch = 'master',
) => octo.git.updateRef({
  owner: org,
  repo,
  ref: `heads/${branch}`,
  sha: commitSha,
});

export {
  getLatestCommit, createBlobForString, createNewTree, createNewCommit, setBranchToCommit,
};
