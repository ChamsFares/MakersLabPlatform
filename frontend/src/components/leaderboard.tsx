import React from "react";

interface Robot {
  id: string;
  name: string;
  score: number;
  time: number;
}

interface LeaderboardProps {
  robots: { [key: string]: Robot };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ robots }) => {
  const sortByScoreAndTime = (data: Robot[]) => {
    return data.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time - b.time;
    });
  };

  const sortedRobots = sortByScoreAndTime(Object.values(robots));

  return (
    <div>
      <h2>Leaderboard</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedRobots.map((robot) => (
            <tr key={robot.id}>
              <td>{robot.name}</td>
              <td>{robot.score}</td>
              <td>{robot.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
