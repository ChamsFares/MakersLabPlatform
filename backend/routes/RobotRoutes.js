const express = require("express");
const RobotController = require("./controllers/RobotControllers");

const router = express.Router();

router.get("/", RobotController.getRobots);

router.post("/:name", RobotController.updatedisqualificationstatus);

module.exports = router;
