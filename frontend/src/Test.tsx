import React from "react";
import axios from "axios";

interface RobotButtonsProps {
  robotId: string;
}

const RobotButtons: React.FC<RobotButtonsProps> = ({ robotId }) => {
  const handleButtonClick = async (
    deb: number,
    challenge1: number,
    challenge2: number,
    challenge3: number,
    challenge4: number,
    challenge5: number,
    fin: number
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/${robotId}/update?deb=${deb}&challenge1=${challenge1}&challenge2=${challenge2}&challenge3=${challenge3}&challenge4=${challenge4}&challenge5=${challenge5}&fin=${fin}`
      );
      console.log(`Button clicked. Response:`, response.data);
    } catch (error) {
      console.error(`Error updating robot details for button:`, error);
    }
  };

  return (
    <div>
      <h2>test Buttons</h2>
      <button onClick={() => handleButtonClick(1, 0, 0, 0, 0, 0, 0)}>
        deb
      </button>
      <button onClick={() => handleButtonClick(1, 1, 0, 0, 0, 0, 0)}>
        challenge1
      </button>
      <button onClick={() => handleButtonClick(1, 1, 1, 0, 0, 0, 0)}>
        challenge2
      </button>
      <button onClick={() => handleButtonClick(1, 1, 1, 1, 0, 0, 0)}>
        challenge3
      </button>
      <button onClick={() => handleButtonClick(1, 1, 1, 1, 1, 0, 0)}>
        challenge4
      </button>
      <button onClick={() => handleButtonClick(1, 1, 1, 1, 1, 1, 0)}>
        challenge5
      </button>
      <button onClick={() => handleButtonClick(1, 1, 1, 1, 1, 1, 1)}>
        fin
      </button>
    </div>
  );
};

export default RobotButtons;
