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
  // ${currentUser ? showThumbUp(story) : ""}
  // <span> <i id='favorite' class = 'fas fa-thumbs-up'> </i> </span>

  const hostName = story.getHostName();
  return $(`
  <li id="${story.storyId}">
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
// --------------------------------------

async function updateFavorite(evt) {
  let $target = $(evt.target);
  let $targetI = $target.closest("i");
  let $storyId = $target.closest("li").attr("id");
  let $currentClass = $target.attr("class");
  let $currentId = $target.attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  }
}

$storiesList.on("click", updateFavorite);

function verifyThumbUp(story) {
  let favoriteStatus = currentUser.favoriteCheck(story);
  if (favoriteStatus) {
    return `<span id = "favoriteIcon"> <i id='favorite' class = 'fas fa-thumbs-up'> </i> </span>`;
  } else {
    return `<span id = "favoriteIcon"> <i id='favorite' class = 'far fa-thumbs-up'> </i> </span> `;
  }
}

// --------------------------------------------------

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    let $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function addNewStory(evt) {
  evt.preventDefault();

  // grab author, title, and url from form
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let storyData = { author, title, url };

  newStory = await StoryList.addStory(currentUser, storyData);

  $newStoryForm.trigger("reset");
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$newStoryForm.on("submit", addNewStory);
