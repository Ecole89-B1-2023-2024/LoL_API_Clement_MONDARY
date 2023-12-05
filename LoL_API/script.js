const selectionSection = document.getElementById("selection");
const jsonUrl =
  "https://ddragon.leagueoflegends.com/cdn/13.23.1/data/fr_FR/champion.json";

const displayRandomChampionInfo = (championData) => {
  const championNames = Object.keys(championData.data);
  const randomChampionName =
    championNames[Math.floor(Math.random() * championNames.length)];
  const randomChampion = championData.data[randomChampionName];

  const h2Element = document.querySelector(".figc h2");
  const h1Element = document.querySelector(".figc h1");
  const imgElement = document.querySelector(".front img");
  const aboutChampionLink = document.getElementById("aboutChampion");

  console.log("Nom du champion aléatoire :", randomChampion.name);
  console.log("Titre du champion aléatoire :", randomChampion.title);
  console.log(
    "Lien sprite du champion aléatoire :",
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.id}_0.jpg`
  );

  // Ajouter le lien vers champion.html avec l'ID du champion aléatoire
  aboutChampionLink.href = `champion.html?id=${randomChampion.id}`;

  h2Element.textContent = randomChampion.title;
  h1Element.textContent = randomChampion.name;
  const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.id}_0.jpg`;
  imgElement.src = championImageLink;
};

async function main() {
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

  championData = await fetchChampionData();
  displayRandomChampionInfo(championData);
  updateChampionInfoInHTML(championData);

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", async () => {
    const updatedChampionData = await fetchChampionData();
    updateChampionInfoInHTML(updatedChampionData);
    localStorage.setItem("championData", JSON.stringify(updatedChampionData));
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

main();
