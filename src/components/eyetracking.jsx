import React, { useEffect, useState } from 'react';

const GazeTracker = () => {
  const [prediction, setPrediction] = useState({ x: null, y: null });

  useEffect(() => {
    // Ensure WebGazer is available and properly loaded
    if (window.webgazer) {
      window.webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data) {
            setPrediction({ x: data.x, y: data.y });
          }
        })
        .showVideo(true) // Display the camera monitor
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true)
        .begin();
    }

    // Cleanup on component unmount
    return () => {
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  return (
    <div>
    </div>
  );
};

export default GazeTracker;
