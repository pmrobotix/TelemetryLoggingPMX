import { useState, useEffect, useCallback } from 'react';

function useWebSocket(onMessage) {

    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://192.168.1.123:5001');

        ws.onopen = function() {
            console.log("WebSocket open");
        };

        ws.onclose = function() {
            console.log("WebSocket close");
        }

        setWebSocket(ws);
    }, []);

    useEffect(() => {
        if(webSocket) {
            webSocket.onmessage = function(message) {
                console.log(message.data);
                onMessage(JSON.parse(message.data));
            };
        }
    }, [webSocket, onMessage]);

    const send = useCallback((message) => {
        if(webSocket.readyState === webSocket.OPEN) {
            webSocket.send(message);
        } else {
            console.log("WebSocket not open");
        }
    }, [webSocket]);

    return send;
}

export default useWebSocket;
