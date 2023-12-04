const selectionSection = document.getElementById("selection");
const jsonUrl =
  "https://ddragon.leagueoflegends.com/cdn/13.23.1/data/fr_FR/champion.json";

// Fonction principale asynchrone
async function main() {
  // Fonction pour récupérer les données du champion
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

  // Charger les données du champion à partir du localStorage s'il y en a
  let championData = JSON.parse(localStorage.getItem("championData"));

  // Si les données ne sont pas dans le localStorage, effectuer une nouvelle requête
  if (!championData) {
    championData = await fetchChampionData();
    // Stocker les nouvelles données dans le localStorage
    localStorage.setItem("championData", JSON.stringify(championData));
  }

  // Créer et ajouter les éléments HTML pour chaque champion
  for (const championName of Object.keys(championData.data).sort()) {
    const champion = championData.data[championName];

    // Construire le lien de l'image avec le format attendu
    const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

    // Créer le HTML pour le champion
    const championHTML = `
          <div>
              <img src="${championImageLink}" />
              <h3>${champion.name}</h3>
          </div>
      `;

    // Ajouter le HTML à la section #selection
    selectionSection.insertAdjacentHTML("beforeend", championHTML);
  }

  // Fonction pour mettre à jour le HTML avec les informations d'un champion
  function updateChampionInfoInHTML(championData) {
    // Effacer le contenu existant dans la section #selection
    selectionSection.innerHTML = "";

    const championNames = Object.keys(championData.data);

    // Mettre à jour le HTML avec les informations de tous les champions
    championNames.forEach((championName) => {
      const champion = championData.data[championName];

      // Construire le lien de l'image avec le format attendu
      const championImageLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

      // Créer le HTML pour le champion
      const championHTML = `
          <div>
              <img src="${championImageLink}" />
              <h3>${champion.name}</h3>
          </div>
        `;

      // Ajouter le HTML à la section #selection
      selectionSection.insertAdjacentHTML("beforeend", championHTML);
    });
  }

  // Charger les données du champion et afficher les informations d'un champion au hasard
  displayRandomChampionInfo(championData);
  updateChampionInfoInHTML(championData);

  // Ajouter un gestionnaire d'événements sur le bouton "RAFRAÎCHIR"
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", async () => {
    // Rafraîchir les données du champion et afficher les informations
    const updatedChampionData = await fetchChampionData();
    updateChampionInfoInHTML(updatedChampionData);

    // Stocker les données du champion dans le localStorage
    localStorage.setItem("championData", JSON.stringify(updatedChampionData));
  });
}

main();
