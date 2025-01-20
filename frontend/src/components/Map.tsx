import React, { useEffect, useState, useRef } from "react";
import Defaultimg from "../assets/challengesImgs/default.png";
import challenge1img from "../assets/challengesImgs/challenge1.png";
import challenge2img from "../assets/challengesImgs/challenge2.png";
import challenge3img from "../assets/challengesImgs/challenge3.png";
import challenge4img from "../assets/challengesImgs/challenge4.png";
import challenge5img from "../assets/challengesImgs/challenge5.png";
import fin from "../assets/challengesImgs/fin.png";
import io from "socket.io-client";
import Test from "../Test";
import Swal from "sweetalert2";
import "../App.css";

interface Robot {
  id: string;
  name: string;
  score: number;
  time: number;
  challenge1: number;
  challenge2: number;
  challenge3: number;
  challenge4: number;
  challenge5: number;
  fin: number;
}

interface MapProps {
  robotId: string;
  robotName: string;
  score: number;
  update: (score: number, increment: number) => void;
  resetMap: boolean;
  onResetComplete: () => void;
  stopwatch: number;
  setStopwatch: React.Dispatch<React.SetStateAction<number>>;
  isStopwatchRunning: boolean;
  formatTime: (milliseconds: number) => string;
  completedOrDisqualifiedRobotsRef: React.MutableRefObject<Set<string>>;
}

const Map: React.FC<MapProps> = ({
  robotId,
  robotName,
  score,
  update,
  resetMap,
  onResetComplete,
  stopwatch,
  setStopwatch,
  isStopwatchRunning,
  formatTime,
  completedOrDisqualifiedRobotsRef,
}) => {
  const challengesCompletedRef = useRef<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [img, setImg] = useState<string>(Defaultimg);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resetMap) {
      challengesCompletedRef.current = [
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      setImg(Defaultimg);
      onResetComplete();
    }
  }, [resetMap, onResetComplete]);
  const banner = (score: number) => {
    Swal.fire({
      title: "challange completed",
      text: "Your score is " + score,
      timer: 450,
      backdrop: false,
      showConfirmButton: false,
      didOpen: () => {
        const timer = Swal.getPopup()?.querySelector("b");
        setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(0);
      },
    });
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("robotDetails", (data: Robot) => {
      console.log("Received robot details:", data);
      if (data.challenge1 > 0 && !challengesCompletedRef.current[0]) {
        challengesCompletedRef.current[0] = true;
        banner(data.challenge1);
        setImg(challenge1img);
        update(score, data.challenge1);
      }
      if (data.challenge2 > 0 && !challengesCompletedRef.current[1]) {
        challengesCompletedRef.current[1] = true;
        banner(data.challenge2);
        setImg(challenge2img);
        update(score, data.challenge2);
      }
      if (data.challenge3 > 0 && !challengesCompletedRef.current[2]) {
        challengesCompletedRef.current[2] = true;
        banner(data.challenge3);
        setImg(challenge3img);
        update(score, data.challenge3);
      }
      if (data.challenge4 > 0 && !challengesCompletedRef.current[3]) {
        challengesCompletedRef.current[3] = true;
        banner(data.challenge4);
        setImg(challenge4img);
        update(score, data.challenge4);
      }
      if (data.challenge5 > 0 && !challengesCompletedRef.current[4]) {
        challengesCompletedRef.current[4] = true;
        banner(data.challenge5);
        setImg(challenge5img);
        update(score, data.challenge5);
      }
      if (data.fin > 0 && !challengesCompletedRef.current[5]) {
        challengesCompletedRef.current[5] = true;
        banner(data.fin);
        setImg(fin);
        update(score, data.fin);
        completedOrDisqualifiedRobotsRef.current.add(robotId);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    const interval = setInterval(() => {
      if (robotId) {
        socket.emit("getRobotDetails", robotId);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      socket.disconnect();
      console.log("Disconnected from Socket.IO server");
    };
  }, [robotId, score]);

  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatch((prevTime) => prevTime + 100);
      }, 100);
    } else if (!isStopwatchRunning && stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
      stopwatchIntervalRef.current = null;
    }
    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    };
  }, [isStopwatchRunning, setStopwatch]);

  return (
    <div>
      <h2>Map</h2>
      <p>Robot Name: {robotName}</p>
      <p>Score: {score}</p>
      <p>Time: {formatTime(stopwatch)}</p>
      <img src={img} alt="Challenge" className="img" />
      <Test robotId={robotId} />
    </div>
  );
};

export default React.memo(Map);
