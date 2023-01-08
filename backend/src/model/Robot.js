// Robot.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

import { Recording } from "./Recording.js";

class Robot {

    #socket;
    #recording;

    constructor(socket) {
        this.#socket = socket;
        this.#recording = new Recording("recording1"); // TODO: Generate unique id
    }

    onDisconnect() {
        this.#socket = null;
    }

    getSocket() {
        return this.#socket;
    }

    onMessage(message) {
        switch(message.type) {
            case "add": {
                const timestamp = message.content.timestamp;
                const data = message.content.data;
                
                this.#recording.recordIncrementalData(timestamp, data);
                break;
            }
            case "erase": {
                const timestamp = message.content.timestamp;
                const data = message.content.data;
                
                this.#recording.recordDataToErase(timestamp, data);
                break;
            }
            default: {
                console.log("Unknown message type: " + message.type);
            }
        }
    }

    send(message) {
        if(this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(message);
        } else {
            console.log("Socket is not open");
        }
    }
}

export { Robot };
