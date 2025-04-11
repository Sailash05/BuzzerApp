const socket = io("http://192.168.1.7:4000");

function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomCode += characters[randomIndex];
    }
    return roomCode;
}

document.querySelector('#create-room-btn').addEventListener('click', () => {
    let roomCode = generateRoomCode();

    socket.emit("joinRoom", { roomCode, teamName: "admin", isAdmin: true });

    document.querySelector('main').innerHTML = `
        <h1>Admin</h1>
        <h3 id="room-code-txt">Room Code : <span>${roomCode}</span></h3>
        <button type="button" id="unlock-btn">Unlock</button>
        <table>
            <thead>
                <tr>
                    <th>Sno</th>
                    <th>Team Name</th>
                    <th>Time (ms)</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `;

    document.querySelector('#unlock-btn').addEventListener("click", () => {
        if (roomCode) {
            let buzzList = document.querySelector('table > tbody').innerHTML = '';
            socket.emit("admin", { roomCode, command: "UNLOCK" });
        }
    });
});


socket.on("client", (buzzListData) => {
    let buzzList = document.querySelector('table > tbody');
    buzzList.innerHTML = ''; // Clear list
    buzzListData.forEach(({ teamName, time }, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index+1}</td>
            <td>${teamName}</td>
            <td>${time} ms</td>
        `;
        buzzList.appendChild(row);
    });
});