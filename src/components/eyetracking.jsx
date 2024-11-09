import React, { useEffect, useState } from "react";
import VotingComponent from "./info";

const GazeTracker = () => {
    const [prediction, setPrediction] = useState({ x: null, y: null });
    const [currentDirection, setCurrentDirection] = useState("Ready");
    const [isRandomizing, setIsRandomizing] = useState(false);
    const [testResults, setTestResults] = useState([
        false,
        false,
        false,
        false,
    ]);
    const [isSuccessful, setIsSuccessful] = useState(true);

    const startRandomizing = () => {
        setIsRandomizing(true);
    };

    useEffect(() => {
        let interval;
        if (isRandomizing) {
            interval = setInterval(() => {
                const directions = [
                    "👈 Left",
                    "Right 👉",
                    "👆\nUp",
                    "Down\n👇",
                ];
                const randomDirection =
                    directions[Math.floor(Math.random() * directions.length)];
                setCurrentDirection(randomDirection);
            }, 3000); // Change every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRandomizing]);

    useEffect(() => {
        // Ensure WebGazer is available and properly loaded
        if (window.webgazer) {
            window.webgazer
                .setGazeListener((data, elapsedTime) => {
                    if (data) {
                        var xprediction = data.x; //these x coordinates are relative to the viewport
                        var yprediction = data.y;
                        console.log(xprediction);
                        setPrediction({ x: xprediction, y: yprediction });
                        //checkGazePosition(xprediction, yprediction);
                    }

                    // console.log(xprediction);
                    // setPrediction({x: xprediction, y: yprediction});
                })
                .showVideo(true) // Display the camera monitor
                .showFaceOverlay(true)
                .saveDataAcrossSessions(false)
                .showFaceFeedbackBox(true)
                .begin();
        }
    }, []);

    const getOverlayStyles = () => {
        const styles = {
            top: { display: "none" },
            bottom: { display: "none" },
            left: { display: "none" },
            right: { display: "none" },
        };

        if (prediction.x !== null && prediction.y !== null) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const margin = 300; // Define margin to consider as "near"

            const isNearTop = prediction.y < margin;
            const isNearBottom = prediction.y > windowHeight - margin;
            const isNearLeft = prediction.x < margin;
            const isNearRight = prediction.x > windowWidth - margin;

            // Check if not at the corner
            if (
                !(isNearTop && (isNearLeft || isNearRight)) &&
                !(isNearBottom && (isNearLeft || isNearRight))
            ) {
                if (isNearTop) {
                    styles.top = {
                        display: "block",
                        backgroundColor: "rgba(0, 255, 0, 0.5)",
                    };
                }
                if (isNearBottom) {
                    styles.bottom = {
                        display: "block",
                        backgroundColor: "rgba(0, 255, 0, 0.5)",
                    };
                }
                if (isNearLeft) {
                    styles.left = {
                        display: "block",
                        backgroundColor: "rgba(0, 255, 0, 0.5)",
                    };
                }
                if (isNearRight) {
                    styles.right = {
                        display: "block",
                        backgroundColor: "rgba(0, 255, 0, 0.5)",
                    };
                }
            }
        }

        return styles;
    };

    const overlayStyles = getOverlayStyles();

    return (
        <>
            <VotingComponent
                isSuccessful={isSuccessful}
                style={{ zIndex: 1001 }}
            ></VotingComponent>
            <div>
                <a href="https://www.google.com">click here</a>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        position: "fixed",
                        right: 0,
                        top: 0,
                        margin: 0,
                        padding: 0,
                        // width: "100%",
                        // backgroundColor: "white",
                        // padding: "10px",
                        zIndex: 1000, // Ensure it appears above other elements
                    }}
                    //className="flex flex-row absolute top-0 left-0 w-full pad-[10px] z-[1000]"
                >
                    <p>
                        Current Gaze Position: X:{" "}
                        {prediction.x ? prediction.x.toFixed(2) : "N/A"}, Y:{" "}
                        {prediction.y ? prediction.y.toFixed(2) : "N/A"}
                    </p>
                </div>
                <button
                    onClick={() => {
                        const directions = [
                            "👈 Left",
                            "Right 👉",
                            "👆\nUp",
                            "Down\n👇",
                        ];
                        const randomDirection =
                            directions[
                                Math.floor(Math.random() * directions.length)
                            ];
                        setCurrentDirection(randomDirection);
                        startRandomizing();
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        position: "fixed",
                        right: 0,
                        top: "3em",
                        margin: 0,

                        fontSize: 30,
                        zIndex: 1000,
                        border: "solid",
                        padding: "4px", // Ensure it appears above other elements
                    }}
                >
                    Start Human Testing
                </button>
                <div
                    style={{
                        // display: "flex",
                        // flexDirection: "row",
                        // position: "fixed",
                        // right: 0,
                        // top: "5em",
                        // margin: 0,
                        // padding: 0,
                        fontSize: 40,

                        zIndex: 1000, // Ensure it appears above other elements
                    }}
                >
                    <span>{currentDirection}</span>
                </div>

                <div
                    style={{
                        ...overlayStyles.top,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "50%",
                        zIndex: 999,
                    }}
                ></div>
                <div
                    style={{
                        ...overlayStyles.bottom,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "50%",
                        zIndex: 999,
                    }}
                ></div>
                <div
                    style={{
                        ...overlayStyles.left,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        height: "100%",
                        zIndex: 999,
                    }}
                ></div>
                <div
                    style={{
                        ...overlayStyles.right,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        zIndex: 999,
                    }}
                ></div>
            </div>
        </>
    );
};

export default GazeTracker;
