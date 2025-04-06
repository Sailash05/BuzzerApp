const socket = io("http://192.168.1.5:4000");

socket.on("client", (data) => {
    let table = document.querySelector('table > tbody');
    let sno = 1;
    table.innerHTML = ''
    data.forEach(element => {
        let row = `
            <tr>
                <td>${sno++}</td>
                <td>${element.teamName}</td>
                <td>${element.time} ms</td>
            </tr>`
        table.innerHTML += row;
    });
}); 

function send() {
    socket.emit("admin", 'UNLOCK');
}