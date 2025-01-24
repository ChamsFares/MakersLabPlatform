require("dotenv").config({ path: "../../.env" });
const admin = require("firebase-admin");
const fs = require("fs");
const { format } = require("fast-csv");

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error(
    "DATABASE_URL is not defined in the environment. Firebase is not initialized."
  );
} else {
  const serviceAccount = require("../utils/serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
  });
  const db = process.env.DATABASE_URL ? admin.database() : null;

  experts.exportToCSV = async () => {
    if (!db) {
      console.error("Database is not initialized. Cannot export data.");
      return;
    }

    try {
      const ref = db.ref(process.env.FIREBASE_DATABASE_PATH);
      const snapshot = await ref.once("value");
      const data = snapshot.val();

      if (!data) {
        console.log("No data found at the specified database path.");
        return;
      }
      const rows = Object.keys(data).map((key, index) => {
        return { id: index + 1, ...data[key] };
      });

      const csvFile = fs.createWriteStream("output.csv");
      format.write(rows, { headers: true }).pipe(csvFile);

      console.log("Data has been exported to output.csv");
    } catch (error) {
      console.error("Error exporting data to CSV:", error);
    }
  };
}
