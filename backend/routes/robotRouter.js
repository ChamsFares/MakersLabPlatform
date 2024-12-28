const express = require("express");
const router = express.Router();
const robotController = require("../controllers/RobotControllers");
const leaderboardController = require("../controllers/leaderboardController");

router.get("/", leaderboardController.getLeaderboard);
router.get("/leaderboard", leaderboardController.getLeaderboard);
router.get("/:name", robotController.getRobotDetails);

module.exports = router;
