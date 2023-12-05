function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", async function () {
  const champImage = document.querySelector(".blurchamp");
  const spriteImage = document.querySelector(".champsprite");
  const h2Element = document.querySelector(".figc h2");
  const h1Element = document.querySelector(".figc h1");
  const titleElement = document.querySelector("title");

  const championId = getQueryParam("id");
  const championInfoUrl = `https://ddragon.leagueoflegends.com/cdn/13.23.1/data/fr_FR/champion/${championId}.json`;

  try {
    const response = await fetch(championInfoUrl);
    const championInfo = await response.json();

    h2Element.textContent = championInfo.data[championId].title;
    h1Element.textContent = championInfo.data[championId].name;
    champImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championInfo.data[championId].id}_0.jpg`;
    spriteImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championInfo.data[championId].id}_0.jpg`;
    titleElement.textContent = championInfo.data[championId].name;

    console.log("Informations du champion :", championInfo);
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations du champion :",
      error
    );
  }
});
