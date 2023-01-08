import './App.css';

import useWebSocket from './hooks/useWebSocket';
import DataPlayer from './DataPlayer';
import Recording from './model/Recording';
import { useState, useRef, useCallback } from 'react';

function App() {
    const recordingRef = useRef(null);
    const [recordingState, setRecordingState] = useState(null);

    const onMessage = useCallback((message) => {
        switch(message.type) {
            case "recordFragment": {
                if(recordingRef.current) {
                    const timestamp = message.content.timestamp;
                    if(message.content.completeData) {
                        recordingRef.current.recordReferenceData(timestamp, message.content.completeData);
                    } else {
                        if(message.content.incrementalData) {
                            recordingRef.current.recordIncrementalData(timestamp, message.content.incrementalData);
                        }
                        if(message.content.dataToErase) {
                            recordingRef.current.recordDataToErase(timestamp, message.content.dataToErase);
                        }
                    }
                } else {
                    console.log("Received data for recording but, recording is null.");
                }
                break;
            }
            default: {
                console.log("Unknown message type: " + message.type);
            }
        }
    }, []);

    const send = useWebSocket(onMessage);

    function downloadRecording(id) {
        recordingRef.current = new Recording(id);
        setRecordingState(recordingRef.current);

        const message = JSON.stringify({
            type: "streamRecording",
            content: {
                recordingId: id
            }
        });

        send(message);
    }

    const recordingToDownload = "recording1";
    //const recordingToDownload = "sample1";

    return (
        <div className="App">
            <button type="button" onClick={() => downloadRecording(recordingToDownload)}>Download {recordingToDownload}</button>
            {recordingState && <DataPlayer recording={recordingState} />}
        </div>
    );
}

export default App;
