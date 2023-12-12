function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function fetchChampionInfoUrl(championId, versionUrl) {
  try {
    const response = await fetch(versionUrl);
    const versionData = await response.json();
    const latestVersion = versionData[0].toString();
    return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/champion/${championId}.json`;
  } catch (error) {
    console.error("Erreur lors du chargement de la version du patch :", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const championId = getQueryParam("id");
  const jsonVersionUrl =
    "https://ddragon.leagueoflegends.com/api/versions.json";
  const championInfoUrl = await fetchChampionInfoUrl(
    championId,
    jsonVersionUrl
  );

  try {
    const response = await fetch(championInfoUrl);

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    const championInfo = await response.json();

    const champImage = document.querySelector(".blurchamp");
    const spriteImage = document.querySelector(".champsprite");
    const h2Element = document.querySelector(".figc h2");
    const h1Element = document.querySelector(".figc h1");
    const titleElement = document.querySelector("title");
    const passiveImage = document.querySelector(".passive");
    const qSpellImage = document.querySelector(".qspell");
    const wSpellImage = document.querySelector(".wspell");
    const eSpellImage = document.querySelector(".espell");
    const rSpellImage = document.querySelector(".rspell");
    const loreParagraph = document.querySelector("#legend .description p");
    const spellTitleElement = document.querySelector("#legend .spells h2");
    const spellDescriptionElement = document.querySelector("#legend .spells p");
    const skinSection = document.querySelector("#skin .skinScroll");
    const backgroundImage = document.querySelector(".backgroundImage");

    const championSkins = championInfo.data[championId].skins;

    passiveImage.addEventListener("click", () => {
      displaySpellInfo(
        championInfo.data[championId].passive,
        spellTitleElement,
        spellDescriptionElement
      );
    });

    qSpellImage.addEventListener("click", () => {
      displaySpellInfo(
        championInfo.data[championId].spells[0],
        spellTitleElement,
        spellDescriptionElement
      );
    });

    wSpellImage.addEventListener("click", () => {
      displaySpellInfo(
        championInfo.data[championId].spells[1],
        spellTitleElement,
        spellDescriptionElement
      );
    });

    eSpellImage.addEventListener("click", () => {
      displaySpellInfo(
        championInfo.data[championId].spells[2],
        spellTitleElement,
        spellDescriptionElement
      );
    });

    rSpellImage.addEventListener("click", () => {
      displaySpellInfo(
        championInfo.data[championId].spells[3],
        spellTitleElement,
        spellDescriptionElement
      );
    });

    function displaySpellInfo(spell, titleElement, descriptionElement) {
      titleElement.textContent = spell.name;

      const spellDescription = spell.description;

      const cleanedDescription = spellDescription.replace(/<.*?>/g, " ");

      descriptionElement.textContent = cleanedDescription;
    }

    const spellImages = [
      passiveImage,
      qSpellImage,
      wSpellImage,
      eSpellImage,
      rSpellImage,
    ];

    spellImages.forEach((spellImage) => {
      spellImage.addEventListener("click", () => {
        spellImages.forEach((img) => img.classList.remove("active"));

        spellImage.classList.add("active");
      });
    });

    championSkins.forEach((skin, index) => {
      const isActive = index === 0;
      const skinHTML = `
        <div class="${isActive ? "active" : ""}">
          <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
            championInfo.data[championId].id
          }_${skin.num}.jpg" />
          <h2>${skin.name}</h2>
        </div>
      `;

      skinSection.insertAdjacentHTML("beforeend", skinHTML);
    });

    backgroundImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championInfo.data[championId].id}_0.jpg`;

    skinSection.addEventListener("click", (event) => {
      const clickedDiv = event.target.closest("div");

      if (clickedDiv && clickedDiv.parentElement === skinSection) {
        const skinImage = clickedDiv.querySelector("img");

        backgroundImage.style.opacity = 0;

        setTimeout(() => {
          backgroundImage.src = skinImage.src;
          backgroundImage.style.opacity = 1;
        }, 150);

        const allSkinDivs = document.querySelectorAll("#skin .skinScroll div");
        allSkinDivs.forEach((div) => div.classList.remove("active"));

        clickedDiv.classList.add("active");
      }
    });

    h2Element.textContent = championInfo.data[championId].title;
    h1Element.textContent = championInfo.data[championId].name;
    champImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championInfo.data[championId].id}_0.jpg`;
    spriteImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championInfo.data[championId].id}_0.jpg`;
    titleElement.textContent = championInfo.data[championId].name;

    passiveImage.src = `https://ddragon.leagueoflegends.com/cdn/${championInfo.version}/img/passive/${championInfo.data[championId].passive.image.full}`;
    qSpellImage.src = `https://ddragon.leagueoflegends.com/cdn/${championInfo.version}/img/spell/${championInfo.data[championId].spells[0].image.full}`;
    wSpellImage.src = `https://ddragon.leagueoflegends.com/cdn/${championInfo.version}/img/spell/${championInfo.data[championId].spells[1].image.full}`;
    eSpellImage.src = `https://ddragon.leagueoflegends.com/cdn/${championInfo.version}/img/spell/${championInfo.data[championId].spells[2].image.full}`;
    rSpellImage.src = `https://ddragon.leagueoflegends.com/cdn/${championInfo.version}/img/spell/${championInfo.data[championId].spells[3].image.full}`;

    loreParagraph.textContent = championInfo.data[championId].lore;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations du champion :",
      error
    );
  }
});
