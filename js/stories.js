"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

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
  // Delete functionality
  // Step 1: Models
  // Step 2: Add function to HTML to identify if the posted by username matches the current username and add trash if true.
  // Step 3: stories - deleteStory

  // Note:
  // ${story.username === currentUser.username ? showTrash() : ""}
  // currentUsername is underfined if logged out -> throwing error

  const hostName = story.getHostName();
  return $(`
  <li id="${story.storyId}">
  ${currentUser ? verifyTrash(story) : ""}

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

function verifyTrash(story) {
  if (story.username === currentUser.username) {
    return `<span class = "delete-button"> <i id='delete' class = 'far fa-trash-alt'> </i> </span>`;
  } else {
    return "";
  }
}

// Delete functionality
// Step 1: Models
// Step 2: Stories - generateStoryMarkup
// 3: Function when trash is clicked. Refresh stories after delete

async function deleteStory(evt) {
  let $target = $(evt.target);
  let $closestListId = $target.closest("ol").attr("id");
  let $storyId = $target.closest("li").attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);

  // ? Removing from favorites has to be done before removing from the user story - Not sure why
  await currentUser.removeFavorite(currentUser, $storyId, $story);
  await currentUser.removeStory(currentUser, $storyId, $story);

  updateUI($closestListId);
}
$storiesList.on("click", ".delete-button", deleteStory);

// Updates the stories shown based on the specific list selected to ensure the correct updated stories show on the screen.  Updates UI without a reload.  Used for deleting and favorite-ing stories
function updateUI(closestListId) {
  if (closestListId === "all-stories-list") {
    getAndShowStoriesOnStart();
  } else if (closestListId === "favorite-stories-list") {
    putFavoritesOnPage();
  } else if (closestListId === "own-stories-list") {
    putOwnStoriesOnPage();
  }
}

async function updateFavorite(evt) {
  let $target = $(evt.target);
  let $targetI = $target.closest("i");
  let $storyId = $target.closest("li").attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);
  let $closestListId = $target.closest("ol").attr("id");

  if ($target.hasClass("fas fa-thumbs-up")) {
    await currentUser.removeFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  }

  updateUI($closestListId);
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

function putFavoritesOnPage() {
  $favoriteStoriesList.empty();

  // loop through all favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    let $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

async function addNewStory(evt) {
  evt.preventDefault();

  // grab author, title, and url from form
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let storyData = { author, title, url };

  let newStory = await StoryList.addStory(currentUser, storyData);

  currentUser.addStory(newStory);

  $newStoryForm.trigger("reset");
  // Clear page and redirect to own stories page
  hidePageComponents();
  putOwnStoriesOnPage();
}

$newStoryForm.on("submit", addNewStory);
