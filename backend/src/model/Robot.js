// Robot.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

const RobotState = {

}

class Robot {

    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }

    getId() {
        return this.id;
    }

    getSocket() {
        return this.socket;
    }

}