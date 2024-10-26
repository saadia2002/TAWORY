const PouchDB = require("pouchdb");
const axios = require("axios");
require("dotenv").config(); // Pour charger les variables d'environnement à partir du fichier .env

// Créez une instance de PouchDB pour la base de données locale
const localDB = new PouchDB("my_local_db");

// Configuration de l'URL de votre base de données MongoDB Atlas à partir des variables d'environnement
const remoteDBUrl = process.env.MONGO_URI; // Utilise l'URI de connexion à MongoDB Atlas

// Fonction pour supprimer les documents existants
const deleteExistingDocs = async (ids) => {
  try {
    const existingDocs = await localDB.allDocs({ keys: ids, include_docs: true });
    const docsToDelete = existingDocs.rows
      .filter((row) => row.doc) // Gardez uniquement les documents existants
      .map((row) => ({ _id: row.doc._id, _rev: row.doc._rev, _deleted: true }));

    if (docsToDelete.length > 0) {
      await localDB.bulkDocs(docsToDelete);
      console.log("Documents existants supprimés:", docsToDelete);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression des documents existants:", error);
  }
};

// Fonction pour insérer des exemples de données
const insertSampleData = async () => {
  try {
    const sampleData = [
      {
        _id: "user1",
        name: "Alice",
        email: "alice@example.com",
        role: "admin",
        dateOfBirth: "1995-05-01",
        image: "alice.jpg",
      },
      {
        _id: "user2",
        name: "Bob",
        email: "bob@example.com",
        role: "user",
        dateOfBirth: "1990-03-15",
        image: "bob.jpg",
      },
      {
        _id: "user3",
        name: "Charlie",
        email: "charlie@example.com",
        role: "user",
        dateOfBirth: "1988-10-10",
        image: "charlie.jpg",
      },
    ];

    // Supprimer les documents existants
    await deleteExistingDocs(sampleData.map((doc) => doc._id));

    // Insérez les données dans la base de données locale
    const result = await localDB.bulkDocs(sampleData);
    console.log("Données insérées avec succès:", result);

    // Synchroniser avec MongoDB
    await syncWithMongoDB(sampleData);

    // Affichez les données après l'insertion
    await displayData();
  } catch (error) {
    console.error("Erreur lors de l'insertion des données:", error);
  }
};

// Fonction pour synchroniser les données avec MongoDB
const syncWithMongoDB = async (data) => {
  try {
    const response = await axios.post("http://localhost:5000/api/sync", data);
    console.log("Synchronisation avec MongoDB réussie:", response.data);
  } catch (error) {
    console.error("Erreur de synchronisation avec MongoDB:", error);
  }
};

// Fonction pour récupérer les données de MongoDB qui ne sont pas dans PouchDB
const fetchMissingDataFromMongoDB = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users"); // Assurez-vous que cette route existe
    const mongoData = response.data;

    const localDocs = await localDB.allDocs({ include_docs: true });
    const localIds = new Set(localDocs.rows.map((row) => row.doc._id));

    // Filtrer les données qui ne sont pas dans PouchDB
    const missingDocs = mongoData.filter((doc) => !localIds.has(doc._id));

    if (missingDocs.length > 0) {
      await localDB.bulkDocs(missingDocs);
      console.log("Données manquantes ajoutées à PouchDB:", missingDocs);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données manquantes de MongoDB:", error);
  }
};

// Fonction pour afficher les données
const displayData = async () => {
  try {
    const result = await localDB.allDocs({ include_docs: true });
    console.log("Données dans la base de données:");
    result.rows.forEach((row) => {
      console.log(row.doc);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

// Fonction pour synchroniser les données en temps réel avec MongoDB
const syncDatabases = () => {
  const remoteDB = new PouchDB(remoteDBUrl);

  localDB
    .sync(remoteDB, {
      live: true, // Pour synchroniser en temps réel
      retry: true, // Pour réessayer en cas d'erreurs
    })
    .on("change", async (info) => {
      console.log("Données synchronisées:", info);
      // Après la synchronisation, vérifiez si des données manquent
      await fetchMissingDataFromMongoDB();
    })
    .on("error", (err) => {
      console.error("Erreur de synchronisation:", err);
    });
};

// Appel initial pour insérer des données d'exemple, synchroniser les bases de données et récupérer les données manquantes
insertSampleData()
  .then(() => {
    syncDatabases(); // Démarre la synchronisation après l'insertion des données
    return fetchMissingDataFromMongoDB(); // Récupérer les données manquantes au démarrage
  })
  .catch((err) => {
    console.error("Erreur lors de l'insertion des données d'exemple:", err);
  });
