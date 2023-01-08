import { useCallback, useEffect, useState, useMemo } from 'react';


function DataPlayer( { recording } ) {
    const [timestamp, setTimestamp] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const onDurationChanged = (newDuration) => {
            setDuration(newDuration);
        };

        recording.addOnDurationChanged(onDurationChanged);

        return () => {
            recording?.removeOnDurationChanged(onDurationChanged);
        }
    }, [recording])

    const jump = useCallback((event) => {
        const targetTimestamp = event.target.value;
        console.log("Jump to " + targetTimestamp);
        setTimestamp(targetTimestamp)
    }, [duration]);

    const data = recording.getDataAt(timestamp);

    return <>
        <div id="player">
            <h1>Player</h1>
            <canvas id="canvas" width="640" height="480">
                Your browser does not support the HTML5 canvas tag.
            </canvas>
            <p>Robot position: x {data?.position?.x}, y {data?.position?.y}</p>
            <div id="controls">
                <button id="play">Play</button>
                <button id="pause">Pause</button>
                <button id="direct">Direct</button>
                <input type="range" id="progress" min="0" max={duration} onChange={jump} />
                <p>{JSON.stringify(recording.getDataAt(timestamp))}</p>
            </div>
        </div>
    </>
}

export default DataPlayer;
