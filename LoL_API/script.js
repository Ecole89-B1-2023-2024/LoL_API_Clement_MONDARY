document.addEventListener("DOMContentLoaded", async function () {
  const selectionSection = document.getElementById("selection");
  const jsonVersionUrl =
    "https://ddragon.leagueoflegends.com/api/versions.json";
  let championData;

  const searchInput = document.querySelector("form input");
  searchInput.addEventListener("input", handleSearchInput);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const choseSection = document.querySelector(".chose");
      choseSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  async function fetchChampionDataUrl() {
    try {
      const response = await fetch(jsonVersionUrl);
      const versionData = await response.json();
      const latestVersion = versionData[0];
      return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/champion.json`;
    } catch (error) {
      console.error(
        "Erreur lors du chargement de la version du patch :",
        error
      );
    }
  }

  async function fetchChampionData() {
    const championDataUrl = await fetchChampionDataUrl();

    try {
      const response = await fetch(championDataUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données du champion :",
        error
      );
    }
  }

  championData = JSON.parse(localStorage.getItem("championData"));

  if (!championData) {
    championData = await fetchChampionData();
    localStorage.setItem("championData", JSON.stringify(championData));
  }

  for (const championName of Object.keys(championData.data).sort()) {
    const champion = championData.data[championName];

    const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

    const championHTML = `
      <a href="champion.html?id=${champion.id}">
        <div>
          <img src="${championImageLink}" />
          <h3>${champion.name}</h3>
        </div>
      </a>
    `;

    selectionSection.insertAdjacentHTML("beforeend", championHTML);
  }

  const championLinks = selectionSection.querySelectorAll("a");
  championLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      window.location.href = link.getAttribute("href");
    });
  });

  displayRandomChampionInfo(championData);
  updateChampionInfoInHTML(championData);

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", async () => {
    console.log("Bouton Rafraîchir cliqué");
    try {
      const updatedChampionData = await fetchChampionData();
      console.log("Données mises à jour :", updatedChampionData);
      updateChampionInfoInHTML(updatedChampionData);
      localStorage.setItem("championData", JSON.stringify(updatedChampionData));
      console.log("Données locales mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
    }
  });

  function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    const championLinks = selectionSection.querySelectorAll("a");
    const notFoundMessage = document.querySelector(".notfound");

    let championsFound = false;

    championLinks.forEach((link) => {
      const championName = link.querySelector("h3").textContent.toLowerCase();

      if (championName.includes(searchTerm)) {
        link.style.display = "block";
        championsFound = true;
      } else {
        link.style.display = "none";
      }
    });

    if (!championsFound) {
      notFoundMessage.textContent = `Aucun champion correspondant à "${searchTerm}"`;
    } else {
      notFoundMessage.textContent = "";
    }
  }

  function updateChampionInfoInHTML(championData) {
    selectionSection.innerHTML = "";

    const championNames = Object.keys(championData.data);

    championNames.forEach((championName) => {
      const champion = championData.data[championName];

      const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

      const championHTML = `
        <a href="champion.html?id=${champion.id}">
          <div>
            <img src="${championImageLink}" />
            <h3>${champion.name}</h3>
          </div>
        </a>
      `;

      selectionSection.insertAdjacentHTML("beforeend", championHTML);
    });
  }

  function displayRandomChampionInfo(championData) {
    const championNames = Object.keys(championData.data);
    const randomChampionName =
      championNames[Math.floor(Math.random() * championNames.length)];
    const randomChampion = championData.data[randomChampionName];

    const h2Element = document.querySelector(".figc h2");
    const h1Element = document.querySelector(".figc h1");
    const imgElement = document.querySelector(".front img");
    const aboutChampionLink = document.getElementById("aboutChampion");

    aboutChampionLink.href = `champion.html?id=${randomChampion.id}`;

    h2Element.textContent = randomChampion.title;
    h1Element.textContent = randomChampion.name;
    const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.id}_0.jpg`;
    imgElement.src = championImageLink;
  }
});
