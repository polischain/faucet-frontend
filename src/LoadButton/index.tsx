import React, { useState, useCallback } from "react";
import "./index.css";

function LoadButton({ text, loadingText, hidden, color, onClick }) {

    const [isLoading, setLoading] = useState(false);


    const onTriggerRun = useCallback(() => {
        setLoading(true);
        onClick().then(() => {
            setLoading(false);
        });
    }, [onClick]);

    return (
        <button
            className="BackupButton"
            disabled={isLoading}
            onClick={onTriggerRun}
            style={{
                margin: "10px",
                backgroundColor: color,
                // @ts-ignore
                display: hidden ? "none" : true,
            }}
        >
            {isLoading ? loadingText || "Loading…" : text}
        </button>
    );
}

export default LoadButton;