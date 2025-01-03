import React, { useEffect, useState, useRef } from "react";
import Defaultimg from "../assets/challengesImgs/default.png";
import debutimg from "../assets/challengesImgs/debut.png";
import challenge1img from "../assets/challengesImgs/challenge1.png";
import challenge2img from "../assets/challengesImgs/challenge2.png";
import challenge3img from "../assets/challengesImgs/challenge3.png";
import challenge4img from "../assets/challengesImgs/challenge4.png";
import challenge5img from "../assets/challengesImgs/challenge5.png";
import fin from "../assets/challengesImgs/fin.png";
import io from "socket.io-client";
import Test from "../Test";
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
  debut: number;
  fin: number;
}

interface MapProps {
  robotId: string;
  robotName: string;
  score: number;
  time: number;
  update: (score: number, increment: number) => void;
}

const Map: React.FC<MapProps> = ({
  robotId,
  robotName,
  score,
  time,
  update,
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

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("robotDetails", (data: Robot) => {
      console.log("Received robot details:", data);
      const updatedChallenges = [
        data.debut,
        data.challenge1,
        data.challenge2,
        data.challenge3,
        data.challenge4,
        data.challenge5,
        data.fin,
      ];
      if (updatedChallenges[0] === 1) {
        challengesCompletedRef.current[0] = true;
        update(score, 10);
        setImg(debutimg);
      }
      if (updatedChallenges[1] === 1 && updatedChallenges[0]) {
        challengesCompletedRef.current[1] = true;
        update(score, 20);
        setImg(challenge1img);
      }
      if (updatedChallenges[2] === 1 && updatedChallenges[1]) {
        challengesCompletedRef.current[2] = true;
        update(score, 10);
        setImg(challenge2img);
      }
      if (updatedChallenges[3] === 1 && updatedChallenges[2]) {
        challengesCompletedRef.current[3] = true;
        update(score, 10);
        setImg(challenge3img);
      }
      if (updatedChallenges[4] === 1 && updatedChallenges[3]) {
        challengesCompletedRef.current[4] = true;
        update(score, 10);
        setImg(challenge4img);
      }
      if (updatedChallenges[5] === 1 && updatedChallenges[4]) {
        challengesCompletedRef.current[5] = true;
        update(score, 10);
        setImg(challenge5img);
      }
      if (updatedChallenges[6] === 1 && updatedChallenges[5]) {
        challengesCompletedRef.current[6] = true;
        update(score, 10);
        setImg(fin);
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
  }, [robotId]);

  return (
    <div>
      <h2>Map</h2>
      <p>Robot Name: {robotName}</p>
      <p>Score: {score}</p>
      <p>Time: {time}</p>
      <img src={img} alt="Challenge" className="img" />
      <Test robotId={robotId} />
    </div>
  );
};

export default React.memo(Map);
