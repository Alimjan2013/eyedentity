import React, { useEffect, useState } from "react";
import VotingComponent from "./info";

const GazeTracker = () => {
    const [prediction, setPrediction] = useState({ x: null, y: null });

    //const [isRandomizing, setIsRandomizing] = useState(false);
    const [classification, setClassification] = useState("none");
    const [isSuccessful, setIsSuccessful] = useState(true);

    const directions = ["top", "left", "bottom", "right"];
    const directionTexts = {
        top: "👆\nUp",
        left: "👈 Left",
        right: "Right 👉",
        bottom: "Down\n👇",
    };
    const [currentDirection, setCurrentDirection] = useState("Ready");
    const [testStatus, setTestStatus] = useState("Not started");
    const [flashEffect, setFlashEffect] = useState(false);
    const [stepCount, setStepCount] = useState(0);

    const [matchingTime, setMatchingTime] = useState([0, 0, 0, 0]); // Array for [top, left, bottom, right]
    const [startTime, setStartTime] = useState(null);
    const [timerRunning, setTimerRunning] = useState(false);

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        pointerEvents: "none",
    };

    if (classification === "top") {
        overlayStyle.height = "50%";
        overlayStyle.backgroundColor = "rgba(0, 255, 0, 0.2)";
    } else if (classification === "bottom") {
        overlayStyle.top = "50%";
        overlayStyle.height = "50%";
        overlayStyle.backgroundColor = "rgba(0, 255, 0, 0.2)";
    } else if (classification === "left") {
        overlayStyle.width = "50%";
        overlayStyle.backgroundColor = "rgba(0, 255, 0, 0.2)";
    } else if (classification === "right") {
        overlayStyle.left = "50%";
        overlayStyle.width = "50%";
        overlayStyle.backgroundColor = "rgba(0, 255, 0, 0.2)";
    }

    useEffect(() => {
        const handlePrediction = () => {
            if (!prediction) {
                setClassification("none");
                return;
            }

            const { x, y } = prediction;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const middleXStart = screenWidth * 0.25;
            const middleXEnd = screenWidth * 0.75;
            const middleYStart = screenHeight * 0.25;
            const middleYEnd = screenHeight * 0.75;

            if (
                x > middleXStart &&
                x < middleXEnd &&
                y > middleYStart &&
                y < middleYEnd
            ) {
                // Exclude middle part
                setClassification("none");
            } else if (
                y < screenHeight / 2 &&
                x > middleXStart &&
                x < middleXEnd
            ) {
                // Top half excluding corners and middle
                setClassification("top");
            } else if (
                y > screenHeight / 2 &&
                x > middleXStart &&
                x < middleXEnd
            ) {
                // Bottom half excluding corners and middle
                setClassification("bottom");
            } else if (
                x < screenWidth / 2 &&
                y > middleYStart &&
                y < middleYEnd
            ) {
                // Left side excluding corners and middle
                setClassification("left");
            } else if (
                x > screenWidth / 2 &&
                y > middleYStart &&
                y < middleYEnd
            ) {
                // Right side excluding corners and middle
                setClassification("right");
            } else {
                // Corners or undefined area
                setClassification("none");
            }
        };

        handlePrediction();
    }, [prediction]);

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
                })
                .showVideo(true) // Display the camera monitor
                .showFaceOverlay(true)
                .saveDataAcrossSessions(false)
                .showFaceFeedbackBox(true)
                .begin();
        }
    }, []);

    const startTest = () => {
        setTestStatus("Starting...");
        setCurrentDirection("none");
        setStepCount(0);

        setMatchingTime([0, 0, 0, 0]); // Reset the time array
        setStartTime(null);
        setTimerRunning(false);

        const randomizedDirections = [];
        for (let i = 0; i < 4; i++) {
            const randomDirection =
                directions[Math.floor(Math.random() * directions.length)];
            randomizedDirections.push(randomDirection);
        }

        let index = 0;
        setTimerRunning(true);

        const intervalId = setInterval(() => {
            if (index < randomizedDirections.length) {
                setCurrentDirection(randomizedDirections[index]);
                setTestStatus("Running");
                setStepCount(index + 1);

                if (index === 0) {
                    setStartTime(Date.now());
                }
                setFlashEffect(true);

                // Brief flash effect for better visibility
                setTimeout(() => setFlashEffect(false), 500);
                index++;
            } else {
                clearInterval(intervalId);
                setTimerRunning(false);
                setCurrentDirection("none");
                setTestStatus("Finished test, you can click and try again");
            }
        }, 3000);
    };

    useEffect(() => {
        let timerId;
        if (
            timerRunning &&
            currentDirection !== "none" &&
            classification === currentDirection
        ) {
            timerId = setInterval(() => {
                setMatchingTime((prevTime) => {
                    const directionIndex = directions.indexOf(currentDirection);
                    const newTimeArray = [...prevTime];
                    newTimeArray[directionIndex] += 0.1; // Increment by 0.1s for every 100ms check
                    return newTimeArray;
                });
            }, 100);
        }

        return () => clearInterval(timerId);
    }, [classification, currentDirection, timerRunning]);

    const totalMatchingTime = matchingTime.reduce((acc, time) => acc + time, 0);

    return (
        <>
            <div style={overlayStyle}></div>
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
                    onClick={startTest}
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
                        backgroundColor: flashEffect
                            ? "rgba(0, 255, 255, 0.2)"
                            : "transparent",
                        zIndex: 999, // Ensure it appears above other elements
                    }}
                >
                    {testStatus === "Starting..." && "Starting..."}
                    {testStatus === "Running" &&
                        currentDirection !== "none" && (
                            <div>
                                <div>Step {stepCount}:</div>
                                <div>{directionTexts[currentDirection]}</div>
                            </div>
                        )}
                    {testStatus ===
                        "Finished test, you can click and try again" && (
                        <div>
                            Finished test, you can click and try again
                            <div>
                                Matching times:{" "}
                                {matchingTime
                                    .map((time) => time.toFixed(1))
                                    .join(", ")}
                            </div>
                            <div>
                                Total matching time:{" "}
                                {totalMatchingTime.toFixed(1)}s
                            </div>
                        </div>
                    )}
                </div>
                <div>{currentDirection}</div>
                <div>{classification}</div>
            </div>
        </>
    );
};

export default GazeTracker;
