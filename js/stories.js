"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let newStory;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup");

  // 2: Add function to HTML to identify if the posted by username matches the current username.
  const hostName = story.getHostName();
  return $(`
  <li id="${story.storyId}">
  ${story.username === currentUser.username ? showTrash() : ""}
  ${currentUser ? verifyThumbUp(story) : ""}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
    `);
}

function showTrash() {
  return `<span class = "delete-button"> <i id='delete' class = 'far fa-trash-alt'> </i> </span>`;
}

// 3: Function when trash is clicked. Refresh stories after delete
async function deleteStory(evt) {
  console.log(evt.target);
  let $target = $(evt.target);
  let $closestListId = $target.closest("ol").attr("id");
  let $storyId = $target.closest("li").attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);

  await currentUser.removeStory(currentUser, $storyId, $story);
  if ($closestListId === "all-stories-list") {
    getAndShowStoriesOnStart();
  } else if ($closestListId === "favorite-stories-list") {
    await currentUser.removeFavorite(currentUser, $storyId, $story);
    putFavoritesOnPage();
  } else if ($closestListId === "own-stories-list") {
    putOwnStoriesOnPage();
  }
}
$storiesList.on("click", ".delete-button", deleteStory);

async function updateFavorite(evt) {
  console.log(evt.target);
  let $target = $(evt.target);
  let $targetI = $target.closest("i");
  let $storyId = $target.closest("li").attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);

  if ($target.hasClass("fas fa-thumbs-up")) {
    await currentUser.removeFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  }
}

// adding a class as the second argument allows for the selection to become more specific
$storiesList.on("click", ".favoriteBtn", updateFavorite);

function verifyThumbUp(story) {
  let favoriteStatus = currentUser.favoriteCheck(story);
  if (favoriteStatus) {
    return `<span class = "favoriteBtn"> <i id='favorite' class = 'fas fa-thumbs-up'> </i> </span>`;
  } else {
    return `<span class = "favoriteBtn"> <i id='favorite' class = 'far fa-thumbs-up'> </i> </span> `;
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all stories and generate HTML for them
  for (let story of storyList.stories) {
    let $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putOwnStoriesOnPage() {
  $ownStoriesList.empty();
  // loop through all user owned stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    let $story = generateStoryMarkup(story);
    $ownStoriesList.append($story);
  }
  $ownStoriesList.show();
}

async function addNewStory(evt) {
  evt.preventDefault();

  // grab author, title, and url from form
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let storyData = { author, title, url };

  newStory = await StoryList.addStory(currentUser, storyData);
  // console.log(newStory);
  // currentUser.addStory(newStory);

  $newStoryForm.trigger("reset");
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$newStoryForm.on("submit", addNewStory);
