const leaderboardtModel = require("../models/leaderboardModel");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardtModel.Leaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
