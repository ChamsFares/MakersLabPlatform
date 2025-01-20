import React, { useState, useEffect, useRef } from "react";
import Map from "./components/Map";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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

const App: React.FC = (): JSX.Element => {
  const [robotId, setRobotId] = useState<string>("");
  const [robotName, setRobotName] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [startclicked, setStartclicked] = useState<boolean>(false);
  const [isReadyClicked, setIsReadyClicked] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [robotNames, setRobotNames] = useState<string[]>([]);
  const [disqualifiedRobots, setDisqualifiedRobots] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(10);
  const [robotsCache, setRobotsCache] = useState<RobotsCache>({});
  const [resetMap, setResetMap] = useState<boolean>(false);
  const [stopwatch, setStopwatch] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedOrDisqualifiedRobotsRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();

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
        } catch (error) {
          console.error("Error fetching robots:", error);
        }
      }
    };

    fetchData();
  }, [robotsCache, robotId]);

  const chooseRandomRobot = () => {
    const availableRobots = Object.keys(robotsCache).filter(
      (robotId) => !completedOrDisqualifiedRobotsRef.current.has(robotId)
    );

    const randomIndex = Math.floor(Math.random() * availableRobots.length);
    const randomRobotId = availableRobots[randomIndex];
    const robot = robotsCache[randomRobotId];
    setRobotId(randomRobotId);
    setRobotName(robot.name || "Unnamed Robot");
    setScore(robot.score);
    setStopwatch(robot.time || 0);
    setResetMap(true);
  };

  const startReadyCountdown = () => {
    setIsReadyClicked(true);
    setCountdown(120000);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 100) {
          clearInterval(countdownIntervalRef.current!);
          disqualifyRobot();
          return 0;
        }
        return prevCountdown - 100;
      });
    }, 100);
  };

  const startChallenge = () => {
    setStartclicked(true);
    setIsReadyClicked(false);
    setIsStopwatchRunning(true);
    if (timer) {
      clearInterval(timer);
    }
  };

  const disqualifyRobot = () => {
    setIsStopwatchRunning(false);
    Swal.fire({
      title: `${robotName} :La3nat el suiveur 3alaykom!`,
      showDenyButton: true,
      confirmButtonText: "Next",
      denyButtonText: "Retry",
      background: "linear-gradient(#C77700, #FFDD00)",
      preConfirm: () => {
        handleNext();
      },
      preDeny: () => {
        handleRetry();
      },
      didOpen: () => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            Swal.clickConfirm();
          } else if (event.key === "Escape") {
            Swal.clickDeny();
          }
        };

        window.addEventListener("keydown", handleKeyDown);

        Swal.getPopup()?.addEventListener("keydown", handleKeyDown);

        Swal.getPopup()?.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            Swal.clickConfirm();
          } else if (event.key === "Escape") {
            Swal.clickDeny();
          }
        });

        Swal.getPopup()?.addEventListener("keydown", handleKeyDown);
      },
      willClose: () => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            Swal.clickConfirm();
          } else if (event.key === "Escape") {
            Swal.clickDeny();
          }
        };
        window.removeEventListener("keydown", handleKeyDown);
      },
    });
  };

  const updateScore = (score: number, newScore: number) => {
    setScore(score + newScore);
  };

  const handleRetry = () => {
    setIsStopwatchRunning(false);
    setStopwatch(0);
  };

  const handleNext = () => {
    setDisqualifiedRobots([...disqualifiedRobots, robotName]);
    completedOrDisqualifiedRobotsRef.current.add(robotId);
    if (disqualifiedRobots.length === Object.keys(robotsCache).length) {
      navigate("/leaderboard");
    } else {
      chooseRandomRobot();
    }
    setStartclicked(false);
    setIsReadyClicked(false);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const remainingMilliseconds = milliseconds % 1000;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}.${remainingMilliseconds.toString().padStart(3, "0")}`;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "r":
          startReadyCountdown();
          break;
        case "s":
          startChallenge();
          break;
        case "d":
          disqualifyRobot();
          break;
        case "c":
          chooseRandomRobot();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <h1>Robot Challenge</h1>
      <div>
        {robotName && (
          <div>
            {isReadyClicked && <p>Countdown: {formatTime(countdown)}</p>}
          </div>
        )}
      </div>
      <Map
        robotId={robotId}
        robotName={robotName}
        score={score}
        update={updateScore}
        resetMap={resetMap}
        onResetComplete={() => setResetMap(false)}
        stopwatch={stopwatch}
        setStopwatch={setStopwatch}
        isStopwatchRunning={isStopwatchRunning}
        formatTime={formatTime}
        completedOrDisqualifiedRobotsRef={completedOrDisqualifiedRobotsRef}
      />
    </div>
  );
};

export default App;
