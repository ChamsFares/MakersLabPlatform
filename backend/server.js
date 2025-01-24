require("dotenv").config({ path: "../../.env" });
const http = require("http");
const app = require("./app");
const { exportToCSV } = require("./models/expertTocsv");
const { initSocket } = require("./sockets");
const { processCSVData } = require("./models/model");

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (process.env.EXPORT_CSV === "true" && typeof exportToCSV === "function") {
    console.log("EXPORT_CSV is enabled. Starting export...");
    exportToCSV()
      .then(() => {
        console.log("Export completed successfully.");
        processCSVData()
          .then(() => {
            console.log("CSV data processed successfully.");
          })
          .catch((error) => {
            console.error("Error processing CSV data:", error);
          });
      })
      .catch((error) => {
        console.error("Error during export:", error);
      });
  } else {
    console.log(
      "EXPORT_CSV is not enabled or exportToCSV function is not defined. Skipping export."
    );
  }
});
