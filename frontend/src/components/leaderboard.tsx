import axios from "axios";
import lineFollower from "../assets/Istic_Robots_2.0_line_follower_icon.png";
import React, { useEffect } from "react";
import "../style/App.css";

interface Robot {
  id: number;
  leaderName: string;
  robotName: string;
  score: number;
  time: number;
  TotalHomPoint: number;
  disqualified: number;
}

interface LeaderboardProps {
  formatTime: (milliseconds: number) => string;
}

const fetchRobots = async () => {
  const response = await axios("http://localhost:3000/api/leaderboard");
  return await response.data;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ formatTime }) => {
  const [robotsRoundOne, setRobotsRoundOne] = React.useState<Robot[]>([]);
  const [robotsRoundTwo, setRobotsRoundTwo] = React.useState<Robot[]>([]);
  const [sortedRobots, setSortedRobots] = React.useState<Robot[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRobots();
      setRobotsRoundOne(data.roundOne);
      setRobotsRoundTwo(data.roundTwo);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (robotsRoundOne.length === 0 || robotsRoundTwo.length === 0) return;

    const combinedRobots = robotsRoundOne.map((robot, index) => {
      const roundTwoRobot = robotsRoundTwo[index];
      return {
        ...robot,
        score: Math.max(robot.score, roundTwoRobot.score),
        time: Math.min(robot.time, roundTwoRobot.time),
        TotalHomPoint: Math.max(
          robot.TotalHomPoint,
          roundTwoRobot.TotalHomPoint
        ),
        disqualified: robot.disqualified || roundTwoRobot.disqualified,
      };
    });

    const qualifiedRobots = combinedRobots.filter(
      (robot) => !robot.disqualified
    );
    const disqualifiedRobots = combinedRobots.filter(
      (robot) => robot.disqualified
    );

    const sortedQualifiedRobots = qualifiedRobots.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      } else if (a.time !== b.time) {
        return a.time - b.time;
      } else {
        return b.TotalHomPoint - a.TotalHomPoint;
      }
    });

    const sortedDisqualifiedRobots = disqualifiedRobots.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      } else if (a.time !== b.time) {
        return a.time - b.time;
      } else {
        return b.TotalHomPoint - a.TotalHomPoint;
      }
    });

    setSortedRobots([...sortedQualifiedRobots, ...sortedDisqualifiedRobots]);
  }, [robotsRoundOne, robotsRoundTwo]);
  console.log(sortedRobots);

  return (
    <div className="container">
      <h1>Leaderboard</h1>
      <div className="playerslist">
        <div className="table">
          <div></div>
          <div>Rank</div>
          <div>Leader Name</div>
          <div>Robot Name</div>
          <div>Score</div>
          <div>time</div>
        </div>
        <div className="list">
          {sortedRobots.map((robot, index) => (
            <div
              className="player"
              key={robot.id}
              style={{
                backgroundColor: robot.disqualified ? "#FFDD00" : "#C77700",
                opacity: robot.disqualified ? 0.7 : 1,
              }}
            >
              <span>
                <img
                  src={lineFollower}
                  alt=""
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
              <span> {index + 1}</span>
              <span> {robot.leaderName} </span>
              <span> {robot.robotName} </span>
              <span> {robot.score} </span>
              <span> {formatTime(robot.time)} </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
