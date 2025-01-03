const { format } = require("path");
const { queryApi, bucket } = require("../utils/influxConfig");

exports.Leaderboard = async () => {
  const query = `from(bucket: "${bucket}") |> range(start: -5d) 
  |> filter(fn: (r) => r._measurement == "competetiontest2")
  |> filter(fn: (r) => r._field == "name" or r._field == "score" or r._field == "tempfinale")
  |> group(columns: ["robot_ID", "_field"])`;

  const result = {};

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const rowObject = tableMeta.toObject(row);
        const robotId = rowObject.robot_ID;
        if (!result[robotId]) {
          result[robotId] = {};
        }
        result[robotId][rowObject._field] = rowObject._value;
      },
      error(error) {
        reject(error);
      },
      complete() {
        console.log("Final Result:", result);
        resolve(result);
      },
    });
  });
};
