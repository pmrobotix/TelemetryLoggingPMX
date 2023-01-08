// User.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

import { WebSocket } from "ws";
import { recordings } from "./Recording.js";
import { Stream } from "./Stream.js";

class User {

    #socket;
    #stream;

    constructor(socket) {
        console.log("User connected");
        this.#socket = socket;
        this.#stream = null;
    }

    onDisconnect() {
        console.log("User disconnect");
        if(this.#stream !== null) {
            this.#stream.stop();
        }

        this.#socket = null;
    }

    getSocket() {
        return this.#socket;
    }

    onMessage(message) {
        switch(message.type) {
            case "streamRecording": {
                const recordingId = message.content.recordingId;
                const recording = recordings.get(recordingId);
                if(recording) {
                    this.#setStream(recording);
                } else {
                    console.log("Recording id not found");
                }
                break;
            }
            default: {
                console.log("Unknown message type: " + message.type);
            }
        }
    }

    send(message) {
        if(this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(JSON.stringify(message));
        } else {
            console.log("Socket is not open");
        }
    }

    #setStream(recording) {
        if(this.#stream !== null) {
            this.#stream.stop();
        }

        this.#stream = new Stream(this, recording);
        this.#stream.start();
    }

}

export { User};
