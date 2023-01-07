"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let newStory;
let icon;

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

function generateStoryMarkup(story, mark) {
  console.debug("generateStoryMarkup");

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${currentUser ? showThumbUp(story) : ""}
      
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function showThumbUp(story) {
  let favoriteStatus = currentUser.favoriteCheck(story);
  // console.log(favoriteStatus);
  if (favoriteStatus) {
    return "<i id='favorite' class = 'fas fa-thumbs-up' </i>";
  } else {
    return "<i id='favorite' class = 'far fa-thumbs-up' </i>";
  }
}

// function thunbHtml(storyId) {
//   for (let favStory in currentUser.favorites) {
//     if (currentUser.favorites[favStory].storyId === story.storyId) {
//       icon = "fas fa-thumbs-up";
//     } else {
//       icon = "far fa-thumbs-up";
//     }
//   }
// }

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
/** Gets list of favorite stories from server, generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  let favoritesList = currentUser.favorites;

  // loop through all of our stories and generate HTML for them
  for (let story of favoritesList) {
    let $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

// function favoriteHtml(storyId) {
//   for (let story of currentUser.favorites) {
//     if (currentUser.favorites[story].storyId === storyId) {
//       let $story = generateStoryMarkup(story, (mark = true));
//       $allStoriesList.append($story);
//     } else {
//       let $story = generateStoryMarkup(story, (mark = false));
//       $allStoriesList.append($story);
//     }
//   }
// }

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

// function toggleFavorites(favoriteState) {
//   if (favoriteState == "far fa-thumbs-up") {
//     return $(`
//     <span>
//     <i id="favorite" class="fas fa-thumbs-up"></i>
//     </span>
//   `);
//   } else {
//     return $(`
//     <span>
//     <i id="favorite" class="far fa-thumbs-up"></i>
//     </span>
//   `);
//   }
// }
