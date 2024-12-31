const { writeApi, queryApi, bucket, Point } = require("../utils/influxConfig");

exports.getRobotById = async (id) => {
  const query = `from(bucket: "${bucket}") |> range(start: -5s) 
  |> filter(fn: (r) => r._measurement == "competetiontest2" and r.robot_ID == "${id}")
  |> group(columns: ["_field", "_value"])`;
  const result = new Set();
  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const rowObject = tableMeta.toObject(row);
        console.log("Row Object:", rowObject);
        const entry = JSON.stringify({
          [rowObject._field]: rowObject._value,
        });
        result.add(entry);
      },
      error(error) {
        reject(error);
      },
      complete() {
        const finalResult = Array.from(result).map((entry) =>
          JSON.parse(entry)
        );
        console.log("Final Result:", finalResult);
        resolve(finalResult);
      },
    });
  });
};

exports.updateRobotById = async (id, data) => {
  try {
    const point = new Point("competetiontest2")
      .tag("robot_ID", id)
      .intField("score", parseInt(data.score))
      .intField("tempfinale", data.timefinale)
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`Robot data for ${id} updated successfully.`);
  } catch (error) {
    console.error(`Error updating robot data for ${id}:`, error);
  } finally {
    writeApi.close().catch((err) => {
      console.error("Error closing writeApi:", err);
    });
  }
};
