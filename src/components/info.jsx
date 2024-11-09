import React, { useState } from "react";

// Utility function to hash a string using SHA-256
const hashString = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
};

const VotingComponent = ({ isSuccessful }) => {
    const [info, setInfo] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleButtonClick = async () => {
        setLoading(true);
        setInfo(null);
        setToken("");

        try {
            // Simulate a loading delay of 1 second
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Fetch user's IP information
            const response = await fetch("https://api.ipify.org?format=json");
            const ipData = await response.json();

            // Get browser and device information
            const userAgent = navigator.userAgent;
            const platform = navigator.platform;
            const browser = getBrowserInfo();

            const collectedInfo = {
                ip: ipData.ip,
                userAgent,
                platform,
                browser,
            };

            setInfo(collectedInfo);

            // Concatenate all collected information into a single string
            const concatenatedString = `IP: ${collectedInfo.ip}, Platform: ${collectedInfo.platform}, Browser: ${collectedInfo.browser}, User Agent: ${collectedInfo.userAgent}`;

            // Generate SHA-256 hash
            const hash = await hashString(concatenatedString);
            setToken(hash);
            copyToClipboard(hash);
        } catch (error) {
            console.error("Error fetching IP information:", error);
            setInfo({ error: "Failed to retrieve information" });
        } finally {
            setLoading(false);
        }
    };

    const getBrowserInfo = () => {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
        if (ua.includes("Edge")) return "Edge";
        if (ua.includes("Trident") || ua.includes("MSIE"))
            return "Internet Explorer";
        return "Unknown Browser";
    };

    function copyToClipboard(text) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Text copied to clipboard");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Come to vote</h1>
            <button
                onClick={() => {
                    if (!isSuccessful) {
                        alert("Need to verify");
                    } else {
                        handleButtonClick();
                    }
                }}
                style={{ padding: "10px 20px", margin: "20px 0" }}
            >
                Show My Info
            </button>
            {loading && (
                <div style={{ marginTop: "20px" }}>
                    <div
                        className="loading-spinner"
                        style={{
                            border: "4px solid #f3f3f3",
                            borderRadius: "50%",
                            borderTop: "4px solid #3498db",
                            width: "40px",
                            height: "40px",
                            animation: "spin 1s linear infinite",
                            margin: "auto",
                        }}
                    ></div>
                </div>
            )}

            {!loading && info && (
                <div style={{ marginTop: "20px" }}>
                    <h2 style={{ color: "red" }}>Token copied to clipboard</h2>
                    {info.error ? (
                        <p>{info.error}</p>
                    ) : (
                        <>
                            <ul>
                                <li>
                                    <strong>IP Address:</strong> {info.ip}
                                </li>
                                <li>
                                    <strong>Platform:</strong> {info.platform}
                                </li>
                                <li>
                                    <strong>Browser:</strong> {info.browser}
                                </li>
                                <li>
                                    <strong>User Agent:</strong>{" "}
                                    {info.userAgent}
                                </li>
                            </ul>
                            {token && (
                                <p>
                                    <strong>Token:</strong> {token}
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default VotingComponent;
