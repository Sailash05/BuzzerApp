const socket = io("http://192.168.1.7:4000");

var teamName;
var roomCode;

let reactionTime;
let startTime;

document.querySelector('#join-btn').addEventListener('click', () => {
    teamName = document.querySelector('#team-name').value.trim();
    roomCode = document.querySelector('#room-code').value.trim();
    if(teamName == "" || roomCode == "") {
        alert("Please enter the details and try again");
    }
    else {
        socket.emit("joinRoom", { roomCode, teamName, isAdmin: false });
        document.querySelector('main').innerHTML = `
            <h1>Press the Buzzer</h1>
            <h3>Team Name : <span>${teamName}</span></h3>
            <button type="button" id="buzzer-btn" disabled>Locked</button>
            <h3 id="timer">Time : <span></span></h3>
        `;
        document.querySelector('#buzzer-btn').addEventListener('click', () => {
            reactionTime = Date.now() - startTime;
            document.querySelector('#buzzer-btn').setAttribute('disabled', true);
            document.querySelector('#timer > span').textContent = reactionTime + ' ms';
            send();
        })
    }
});

function send() {
    socket.emit("client", {
        roomCode: roomCode,
        teamName: teamName,
        time: reactionTime
    });
}

socket.on("admin", (command) => {
    if (command == 'UNLOCK') {
        document.querySelector('#buzzer-btn').removeAttribute('disabled');
        startTime = Date.now();
    }
    else if(command == 'ROOM_CLOSED') {
        document.querySelector('main').innerHTML = `
        <h1> Room Closed! </h1>
        <button type="button" id="ok-btn">Okay</button>
        `;
        document.querySelector('#ok-btn').addEventListener('click', () => {
            window.location.reload(true);
        });
    }
});


socket.on("error", (msg) => {
    document.querySelector('main').innerHTML = `
        <h1> Room doesn't exist! </h1>
        <h1> Please try again! </h1>
        <button type="button" id="try-again-btn">Try Again</button>
    `;
    document.querySelector('#try-again-btn').addEventListener('click', () => {
        window.location.reload(true);
    })
});

