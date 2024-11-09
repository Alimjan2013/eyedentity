import "./App.css";
import GazeTracker from "./components/eyetracking";
import VotingComponent from "./components/info";
import { useState } from "react";

function App() {
    return (
        <>
            <div>
                <GazeTracker></GazeTracker>
            </div>
        </>
    );
}

export default App;
