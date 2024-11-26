// Importer les modules Selenium WebDriver
const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver"); // Importer le ChromeDriver

async function testReactApp() {
  // Créer une instance du WebDriver pour Chrome
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Accéder à l'application React.js (assure-toi que l'application tourne sur ce port)
    await driver.get("${process.env.REACT_APP_API_URL}:3000");

    // Vérifier le titre de la page
    let title = await driver.getTitle();
    console.log("Le titre est :", title);

    // Trouver un élément par son sélecteur CSS (par exemple, le bouton avec le texte "Envoyer")
    let button = await driver.findElement(By.xpath("//button[text()='Envoyer']")); // Remplace "Envoyer" par le texte du bouton
    await button.click();

    // Attendre qu'un nouvel élément apparaisse après le clic
    await driver.wait(until.elementLocated(By.id("elementId")), 5000); // Remplace 'elementId' par l'ID de l'élément attendu

    // Vérifier que l'élément est visible
    let newElement = await driver.findElement(By.id("elementId"));
    let isDisplayed = await newElement.isDisplayed();
    console.log("L'élément est affiché :", isDisplayed);
  } catch (error) {
    console.error("Une erreur est survenue :", error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
}

// Lancer le test
testReactApp();
