const { queryApi, bucket } = require("../utils/influxConfig");

exports.Leaderboard = async () => {
  const query = `from(bucket: "${bucket}") |> range(start: -2d) 
  |> filter(fn: (r) => r._measurement == "competetiontest")
  |> group(columns: ["robot_name"])`;

  const result = new Set();

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const rowObject = tableMeta.toObject(row);
        result.add(rowObject.robot_name);
      },
      error(error) {
        reject(error);
      },
      complete() {
        console.log("Final Result:", Array.from(result));
        resolve(Array.from(result));
      },
    });
  });
};
