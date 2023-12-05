function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", function () {
  const champImage = document.querySelector(".blurchamp");
  const spriteImage = document.querySelector(".champsprite");
  const h2Element = document.querySelector(".figc h2");
  const h1Element = document.querySelector(".figc h1");
  const titleElement = document.querySelector("title");

  const championName = getQueryParam("name");
  const championTitle = getQueryParam("title");
  const championImage = getQueryParam("image");

  h2Element.textContent = championTitle;
  h1Element.textContent = championName;
  champImage.src = championImage;
  spriteImage.src = championImage;
  titleElement.textContent = championName;
});
