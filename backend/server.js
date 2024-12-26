const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
//const robotsRoutes = require("./routes/robots");
require("dotenv").config({ path: "../.env" });
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/robots", (res, req) => {
  console.log("");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));