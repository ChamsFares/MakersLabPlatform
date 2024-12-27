require("dotenv").config({ path: "../../env" });

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const org = "makerslab";
const bucket = "makerslabPlatform";
const token = "";
const url = "http://127.0.0.1:8086";

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({ source: "nodejs-client" });

const tags = {
  Robot1: "hmid",
  Robot2: "sfa9",
  Robot3: "shame",
  Robot4: "rizzler",
  Robot5: "nick",
};

const fields = {
  debut: 0,
  fin: 0,
  challenge1: 0,
  challenge2: 0,
  challenge3: 0,
  challenge4: 0,
  challenge5: 0,
  tempfinale: 0,
  disqualification: 0,
};

const robots = Object.keys(tags);
robots.forEach((robotName) => {
  const point = new Point("competetiontest")
    .tag("robot_name", tags[robotName])
    .intField("debut", fields.debut)
    .intField("fin", fields.fin)
    .intField("challenge1", fields.challenge1)
    .intField("challenge2", fields.challenge2)
    .intField("challenge3", fields.challenge3)
    .intField("challenge4", fields.challenge4)
    .intField("challenge5", fields.challenge5)
    .intField("tempfinale", fields.tempfinale)
    .intField("Disqua", fields.disqualification)
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

const queryApi = client.getQueryApi(org);

const fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -1h) // Query data from the last hour
    |> filter(fn: (r) => r["_measurement"] == "competetiontest")
    |> filter(fn: (r)=> r["robot_name"] == "rizzler")
    |> yield(name: "result")
`;

const observer = {
  next: (row) => {
    console.log("Row:", JSON.stringify(row));
  },
  error: (err) => {
    console.error("Error querying InfluxDB:", err);
  },
  complete: () => {
    console.log("Query completed.");
  },
};

queryApi.queryRows(fluxQuery, observer);
