import React, { useState, useEffect } from "react";
import Map from "./components/Map";

import axios from "axios";

import "./App.css";

interface Robot {
  id: string;
  name: string;
  score: number;
  time: number;
}

interface RobotsCache {
  [key: string]: Robot;
}

const fetchRobots = async (): Promise<RobotsCache> => {
  const response = await axios.get("http://localhost:3000/api/leaderboard", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Response:", response);
  if (
    response.status !== 200 ||
    !response.headers["content-type"].includes("application/json")
  ) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.data;
};

const App: React.FC = () => {
  const [robotId, setRobotId] = useState<string>("");
  const [robotName, setRobotName] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [startclicked, setStartclicked] = useState<boolean>(false);
  const [isReadyClicked, setIsReadyClicked] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [robotNames, setRobotNames] = useState<string[]>([]);
  const [disqualifiedRobots, setDisqualifiedRobots] = useState<string[]>([]);
  const [showDisqualifyModal, setShowDisqualifyModal] =
    useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);
  const [robotsCache, setRobotsCache] = useState<RobotsCache>({});

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(robotsCache).length === 0) {
        try {
          const data = await fetchRobots();
          console.log("Fetched robots:", data);
          setRobotsCache(data);
          const robotNames = Object.values(data).map(
            (robot) => robot.name || "Unnamed Robot"
          );
          console.log("Robot names:", robotNames);
          setRobotNames(robotNames);
          if (Object.keys(data).length > 0) {
            const firstRobotId = Object.keys(data)[0];
            const firstRobot = data[firstRobotId];
            setRobotId(firstRobotId);
            setRobotName(firstRobot.name || "Unnamed Robot");
            setScore(firstRobot.score);
            setTime(firstRobot.time);
          }
        } catch (error) {
          console.error("Error fetching robots:", error);
        }
      }
    };

    fetchData();
  }, [robotsCache, robotId]);

  const chooseRandomRobot = () => {
    const availableRobots = Object.keys(robotsCache).filter(
      (robotId) => !disqualifiedRobots.includes(robotsCache[robotId].name)
    );
    if (availableRobots.length === 0) {
      alert("No more robots available");
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableRobots.length);
    const randomRobotId = availableRobots[randomIndex];
    const robot = robotsCache[randomRobotId];

    setRobotId(randomRobotId);
    setRobotName(robot.name || "Unnamed Robot");
    setScore(robot.score);
    setTime(robot.time);
  };

  const startReadyCountdown = () => {
    setIsReadyClicked(true);
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          disqualifyRobot();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    setTimer(interval);
  };

  const startChallenge = () => {
    setStartclicked(true);
    setIsReadyClicked(false);
    if (timer) {
      clearInterval(timer);
    }
  };

  const updateScore = (score: number, newScore: number) => {
    setScore(score + newScore);
  };

  const disqualifyRobot = () => {
    setDisqualifiedRobots([...disqualifiedRobots, robotName]);
    setShowDisqualifyModal(true);
  };

  const handleRetry = () => {
    setShowDisqualifyModal(false);
  };

  const handleNext = () => {
    setShowDisqualifyModal(false);
    chooseRandomRobot();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <h1>Robot Challenge</h1>
      <div>
        <button onClick={chooseRandomRobot}>Choose Robot</button>
        {robotName && (
          <div>
            <button onClick={startReadyCountdown}>Ready</button>
            {isReadyClicked && <p>Countdown: {formatTime(countdown)}</p>}
            <button onClick={startChallenge}>Start</button>
          </div>
        )}
        {startclicked && <button onClick={disqualifyRobot}>Disqualify</button>}
      </div>
      <Map
        robotId={robotId}
        robotName={robotName}
        score={score}
        time={time}
        update={updateScore}
      />
      {showDisqualifyModal && (
        <div className="modal">
          <p>Robot {robotName} has been disqualified.</p>
          <button onClick={handleRetry}>Retry</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default App;
