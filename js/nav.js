"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorite.show();
  $navOwnStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
// function updateNavOnLogout() {
//   $navLogin.show();
//   $navLogOut.hide();
// }

/** Show submit form on click of "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

// Show favorites page

function navFavoritesClick(evt) {
  console.debug("navFavoriteClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$navFavorite.on("click", navFavoritesClick);

// Show Own Stories page

function navOwnStoriesClick(evt) {
  console.debug("navOwnStoriesClick", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
}
$navOwnStories.on("click", navOwnStoriesClick);
