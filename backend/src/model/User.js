// User.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

const UserState = {

}

class User {

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