const socket = io("http://localhost:4000");

socket.on("message", (data) => {
    document.querySelector('.data').textContent = data;
}); 

function send() {
    socket.emit("message", document.querySelector('input').value);
}