const { queryApi, bucket } = require("../utils/influxConfig");

exports.getRobotByName = async (name) => {
  const query = `from(bucket: "${bucket}") |> range(start: -3d) 
  |> filter(fn: (r) => r._measurement == "competetiontest" and r.robot_name == "${name}")
  |> group(columns: ["_field", "_value"])`;
  const result = new Set();
  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const rowObject = tableMeta.toObject(row);
        const entry = JSON.stringify({
          field: rowObject._field,
          value: rowObject._value,
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
