import { useEffect } from "react";

useEffect(() => {
  fetch("/api/leaderboard")
    .then((response) => response.json())
    .then((data) => console.log(data));
}, []);
