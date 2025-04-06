const socket = io("http://192.168.1.5:4000");

socket.on("client", (data) => {
    document.querySelector('.data').textContent = data;
}); 

function send() {
    socket.emit("admin", 'UNLOCK');
}