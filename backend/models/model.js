require("dotenv").config({ path: "../../.env" });
const { writeApi, Point } = require("../utils/influxConfig.js");
const { v4: uuidv4 } = require("uuid");

writeApi.useDefaultTags({ source: "nodejs-client" });

const tags = {
  Robot1: uuidv4(),
  Robot2: uuidv4(),
  Robot3: uuidv4(),
  Robot4: uuidv4(),
  Robot5: uuidv4(),
};

const fields = {
  name: "",
  score: 0,
  debut: 0,
  fin: 0,
  challenge1: 0,
  challenge2: 0,
  challenge3: 0,
  challenge4: 0,
  challenge5: 0,
  tempfinale: 0,
};

const robots = Object.keys(tags);
robots.forEach((robot_ID) => {
  const point = new Point("competetiontest2")
    .tag("robot_ID", tags[robot_ID])
    .stringField("name", fields.name)
    .intField("score", fields.score)
    .intField("debut", fields.debut)
    .intField("fin", fields.fin)
    .intField("challenge1", fields.challenge1)
    .intField("challenge2", fields.challenge2)
    .intField("challenge3", fields.challenge3)
    .intField("challenge4", fields.challenge4)
    .intField("challenge5", fields.challenge5)
    .intField("tempfinale", fields.tempfinale)
    .timestamp(new Date());
  writeApi.writePoint(point);
});
writeApi
  .flush()
  .then(() => {
    console.log("All points flushed to InfluxDB.");
  })
  .catch((err) => {
    console.error("Error flushing points:", err);
  })
  .finally(() => {
    writeApi.close().then(() => {
      console.log("Write API closed successfully.");
    });
  });
