import io from "socket.io-client";

const URL = "http://localhost:3001/";

const socket = io(URL);

let mySocketId;
socket.on("connection", (res) => {
    console.log("hello");
})
socket.on("createNewGame", statusUpdate => {
    console.log("New game");
    console.log("hello")
    mySocketId = statusUpdate.mySocketId;
})

export {
    socket,
    mySocketId
}