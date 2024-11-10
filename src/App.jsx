import "./App.css";
import GazeTracker from "./components/eyetracking";

import { useState, useEffect } from "react";

function App() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            <div>
                {loading ? <div>Loading</div> : <div> </div>}
                <GazeTracker></GazeTracker>
            </div>
        </>
    );
}

export default App;
