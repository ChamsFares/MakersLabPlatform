const robotModel = require("../models/robotModel");
const { emitUpdate } = require("../sockets");

exports.getRobotDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const robot = await robotModel.getRobotById(id);
    if (!robot) {
      return res.status(404).json({ message: "Robot not found" });
    }
    res.json(robot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateRobotDetails = async (req, res) => {
  const { id } = req.params;
  const { score, timefinale } = req.query;

  const data = {
    score: parseInt(score, 0),
    timefinale: parseInt(timefinale, 0),
  };
  try {
    await robotModel.updateRobotById(id, data);
    emitUpdate("robotUpdate", { ...data });
    res.json({ message: "Robot updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
