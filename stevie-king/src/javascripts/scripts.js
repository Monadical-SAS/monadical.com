// Add your scripts here
import 'regenerator-runtime/runtime';

import { JSONEditor } from '@json-editor/json-editor';
import { Octokit } from '@octokit/rest';
import {
  getLatestCommit, createBlobForString, createNewTree, createNewCommit, setBranchToCommit,
}
  from './git';
import { jsonPostSchema } from './postSchema';

const CONTENTS_JSON = 'https://raw.githubusercontent.com/Monadical-SAS/monadical.com/master/content.json';
const REPO_ORGANIZATION = 'Monadical-SAS';
const REPO_NAME = 'monadical.com';
const STEVIE_COMMIT_MESSAGE = 'Stevie King\'s commit';

const { $ } = window;
// From https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
// function uuidv4() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, /
// (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
// }

const publishPost = async (octo, postSlug, postData, imgData, imgExtension) => {
  // Download content from the public repositoty
  const org = REPO_ORGANIZATION;
  const repo = REPO_NAME;
  const commitMessage = `${STEVIE_COMMIT_MESSAGE} - add Post: ${postSlug}`;
  const imgPath = `static/${postSlug}.${imgExtension}`;

  const contentJSON = await (await fetch(CONTENTS_JSON)).json();

  // Get new post content
  // var postKey = uuidv4();
  const newPost = {};
  newPost[postSlug] = postData;
  contentJSON.POSTS = { ...contentJSON.POSTS, ...newPost };

  const contentFile = { data: JSON.stringify(contentJSON, null, 2), utf8encode: true, path: 'content.json' };
  const imageFile = { data: imgData, encoding: 'base64', path: imgPath };

  const latestCommit = await getLatestCommit(octo, org, repo);
  const filesBlobs = await Promise.all([contentFile, imageFile]
    .map(createBlobForString(octo, org, repo)));

  console.log(filesBlobs);

  const pathsForBlobs = [contentFile.path, imageFile.path];
  const newTree = await createNewTree(
    octo,
    org,
    repo,
    filesBlobs,
    pathsForBlobs,
    latestCommit.treeSha,
  );

  const newCommit = await createNewCommit(
    octo,
    org,
    repo,
    commitMessage,
    newTree.sha,
    latestCommit.commitSha,
  );
  await setBranchToCommit(octo, org, repo, newCommit.sha);
  $('#form-errors').addClass('d-none');
  $('#form-success').removeClass('d-none');
};

// const requestContentJSON = async () => {
//   const response = await fetch('https://raw.githubusercontent.com/Monadical-SAS/monadical.com/master/content.json');
//   const json = await response.json();
// };

$(document).ready(() => {
  const element = document.getElementById('editor_holder');
  let saveGithubToken;
  let githubToken;
  let contentJSON;
  const reader = new FileReader();
  let imgExtension;

  // Fetch current site contents
  fetch(CONTENTS_JSON)
    .then((x) => x.json())
    .then((data) => {
      contentJSON = data;
    });

  githubToken = window.localStorage.getItem('githubToken') || '';

  // Custom validators must return an array of errors or an empty array if valid
  JSONEditor.defaults.custom_validators.push((schema, value, path) => {
    const errors = [];
    if (schema.format === 'date') {
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
        // Errors must be an object with `path`, `property`, and `message`
        errors.push({
          path,
          property: 'format',
          message: 'Dates must be in the format "YYYY-MM-DD"',
        });
      }
    }
    return errors;
  });

  // Set an option during instantiation
  const editor = new JSONEditor(element, {
    required_by_default: true,
    disable_properties: true,
    disable_collapse: true,
    disable_array_delete_last_row: true,
    theme: 'bootstrap4',
    iconlib: 'fontawesome5',
    schema: jsonPostSchema,
  });
  editor.getEditor('root.url').disable();
  editor.getEditor('root.template').disable();

  const optionsDropzone = {
    paramName: 'file', // The name that will be used to transfer the file
    url: '/test',
    maxFiles: 1,
    init() {
      this.on('maxfilesexceeded', function (file) {
        this.removeAllFiles();
        this.addFile(file);
      });
    },
    acceptedFiles: '.jpeg,.jpg,.png,.gif',
    addRemoveLinks: true,
    dictRemoveFile: 'Replace File',
    dictDefaultMessage: '<b><h5> <i class="fas fa-image fa-2x"></i><br><br> Click here to select <br> or <br> Drop the post image</h5></b>',
    maxFilesize: 2, // MB
    accept(file, done) {
      // reader.onload = function (e) {
      //   console.log(reader.result, e);
      // };
      imgExtension = file.name.split('.').pop();
      reader.readAsDataURL(file);
      done();
    },
  };
  $('div#mydropzone').dropzone(optionsDropzone);

  editor.watch('root.title', () => {

  });

  $('#slugInput').change(() => {
    const slugText = $('#slugInput').val();
    const postUrl = `/posts/${slugText}.html`;

    const url = editor.getEditor('root.url');
    const template = editor.getEditor('root.template');
    const img = editor.getEditor('root.img');
    url.setValue(postUrl);
    template.setValue(postUrl.substring(1));

    img.setValue(`/static/${slugText}`);
  });

  if (githubToken) {
    $('#githubTokenInput').val(githubToken);
    $('#githubTokenSaveCheck').prop('checked', true);
  }
  $('#githubTokenSaveCheck').change(() => {
    saveGithubToken = $('#githubTokenSaveCheck:checked').val();
  });

  $('#publishPost').click((event) => {
    const slugText = $('#slugInput').val();
    let imgData;
    let errors = [];

    githubToken = $('#githubTokenInput').val();

    // Validators
    errors = editor.validate();

    const validSlug = slugText.match('^[a-z0-9]+(?:-[a-z0-9]+)*$');
    if (!validSlug) {
      errors.push({
        path: 'root.slug',
        property: 'format',
        message: 'The post slug can only contain alpha-numeric characters joined with hyphens i.e poker-networks',
      });
    }
    // Get image data from data:image/png;base64,[data]
    if (reader.result) {
      imgData = reader.result.split(',').pop();
    } else {
      errors.push({
        path: 'root.img',
        property: 'format',
        message: 'The post image is empty, upload an image',
      });
    }

    const postSlugs = Object.keys(contentJSON.POSTS);
    const isDuplicateSlug = postSlugs.includes(slugText);
    if (isDuplicateSlug) {
      alert('Slug already exists, change the slug !');
      errors.push({
        path: 'root.slug',
        property: 'format',
        message: 'Slug Already exists, change the slug',
      });
    }

    if (errors.length) {
      event.preventDefault();
      $('#form-errors').removeClass('d-none');
      errors.forEach((e) => { $('#form-errors-items').append(`<p class="mb-0">${e.path}: ${e.message}</p>`); });
      return;
    }

    const octokit = new Octokit({
      auth: githubToken,
    });

    const postData = editor.getValue();
    const readTime = `${postData.length} min read`;
    postData.length = readTime;
    postData.img = `/static/${slugText}.${imgExtension}`;

    publishPost(octokit, slugText, postData, imgData, imgExtension);

    if (saveGithubToken !== undefined) {
      window.localStorage.setItem('githubToken', githubToken);
    }
    // else {
    //     window.localStorage.removeItem('githubToken');
    // }
  });
});
