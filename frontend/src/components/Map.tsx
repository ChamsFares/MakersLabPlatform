import React from "react";

interface MapProps {
  robotName: string;
  score: number;
  time: number;
}

const Map: React.FC<MapProps> = ({ robotName, score, time }) => {
  return (
    <div>
      <h2>Map</h2>
      <p>Robot Name: {robotName}</p>
      <p>Score: {score}</p>
      <p>Time: {time}</p>
    </div>
  );
};

export default Map;
