const leaderboardtModel = require("../models/robotModel");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardtModel.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
