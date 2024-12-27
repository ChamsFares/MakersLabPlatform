const { queryApi, bucket } = require("../utils/influxConfig");

exports.getLeaderboard = async () => {
  const query = `from(bucket: \"${bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == \"robots\") |> group(columns: [\"name\"]) |> sort(columns: [\"_value\"], desc: true)`;
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
        resolve(result);
      },
    });
  });
};
