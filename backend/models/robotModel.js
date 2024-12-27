const { Point } = require("@influxdata/influxdb-client");
const { writeApi, queryApi, bucket } = require("../utils/influxConfig");

exports.getRobotByName = async (name) => {
  const query = `from(bucket: \"${bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == \"robots\" and r.name == \"${name}\")`;
  const result = [];
  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        result.push(tableMeta.toObject(row));
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result[0]);
      },
    });
  });
};

exports.updateDisqualificationState = async (name, disqualified) => {
  const point = new Point("robots")
    .tag("robot_name", name)
    .intField("disqualified", disqualified);

  writeApi.writePoint(point);
  await writeApi.close();
};
