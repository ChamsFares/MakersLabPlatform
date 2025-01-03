const { writeApi, queryApi, bucket, Point } = require("../utils/influxConfig");

exports.getRobotById = async (id) => {
  const query = `from(bucket: "${bucket}") 
  |> range(start: -1s) 
  |> filter(fn: (r) => r._measurement == "competetiontest2" and r.robot_ID == "${id}")
  |> group(columns: ["_field", "_value"])`;

  const result = {};

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const rowObject = tableMeta.toObject(row);
        console.log("Row Object:", rowObject);
        result[rowObject._field] = rowObject._value;
      },
      error(error) {
        console.error("Query Error:", error);
        reject(error);
      },
      complete() {
        console.log("Final Result:", result);
        resolve(result);
      },
    });
  });
};

exports.updateRobotById = async (id, data) => {
  try {
    const point = new Point("competetiontest2")
      .tag("robot_ID", id)
      .intField("debut", parseInt(data.deb))
      .intField("challenge1", parseInt(data.challenge1))
      .intField("challenge2", parseInt(data.challenge2))
      .intField("challenge3", parseInt(data.challenge3))
      .intField("challenge4", parseInt(data.challenge4))
      .intField("challenge5", parseInt(data.challenge5))
      .intField("fin", parseInt(data.fin))
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`Robot data for ${id} updated successfully.`);
  } catch (error) {
    console.error(`Error updating robot data for ${id}:`, error);
  }
};
