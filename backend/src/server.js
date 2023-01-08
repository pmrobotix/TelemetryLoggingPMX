import { WebSocketServer } from 'ws'
import { Robot } from './model/Robot.js';
import { User } from './model/User.js';


let robots = [];

const robotServer = new WebSocketServer({
    port: 5000
});

robotServer.on('connection', function (socket) {
    const robot = new Robot(socket);
    robots.push(robot);

    socket.on('close', function () {
        robot.onDisconnect();
        robots = robots.filter(r => r !== robot);
    });

    socket.on('message', function (message) {
        robot.onMessage(JSON.parse(message));
    });
});

let users = [];

const userServer = new WebSocketServer({
    port: 5001
});

userServer.on('connection', function (socket) {
    const user = new User(socket);
    users.push(user);

    socket.on('close', function () {
        user.onDisconnect();
        users = users.filter(u => u !== user);
    });

    socket.on('message', function (message) {
        user.onMessage(JSON.parse(message));
    });
});
