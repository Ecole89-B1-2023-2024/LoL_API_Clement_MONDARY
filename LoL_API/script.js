document.addEventListener("DOMContentLoaded", async function () {
  const selectionSection = document.getElementById("selection");
  const jsonUrl =
    "https://ddragon.leagueoflegends.com/cdn/13.23.1/data/fr_FR/champion.json";

  const searchInput = document.querySelector("form input");
  searchInput.addEventListener("input", handleSearchInput);

  async function fetchChampionData() {
    try {
      const response = await fetch(jsonUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données du champion :",
        error
      );
    }
  }

  let championData = JSON.parse(localStorage.getItem("championData"));

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
    const updatedChampionData = await fetchChampionData();
    updateChampionInfoInHTML(updatedChampionData);
    localStorage.setItem("championData", JSON.stringify(updatedChampionData));
  });

  function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    const championLinks = selectionSection.querySelectorAll("a");

    championLinks.forEach((link) => {
      const championName = link.querySelector("h3").textContent.toLowerCase();

      if (championName.includes(searchTerm)) {
        link.style.display = "block";
      } else {
        link.style.display = "none";
      }
    });
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

    // Ajouter le lien vers champion.html avec l'ID du champion aléatoire
    aboutChampionLink.href = `champion.html?id=${randomChampion.id}`;

    h2Element.textContent = randomChampion.title;
    h1Element.textContent = randomChampion.name;
    const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.id}_0.jpg`;
    imgElement.src = championImageLink;
  }
});
