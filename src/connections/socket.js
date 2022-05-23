import io from "socket.io-client";

const URL = "https://chess-with-your-mate.herokuapp.com/";

const socket = io(URL);

let mySocketId;
socket.on("connect", () => {
    console.log(`Connected with ID ${socket.id}`);
})
socket.on("createNewGame", statusUpdate => {
    mySocketId = statusUpdate.mySocketId;
})

export {
    socket,
    mySocketId
}
