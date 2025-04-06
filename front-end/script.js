const socket = io("http://192.168.1.5:4000");

let startTime;
let reactionTime;
let buzzerBtn = document.querySelector('#buzzer-btn');
let team = document.querySelector('#team-name');
buzzerBtn.setAttribute('disabled', true);

socket.on("admin", (data) => {
    if(data == 'UNLOCK') {
        buzzerBtn.removeAttribute('disabled');
        startTime = Date.now();
        document.querySelector('#timer').textContent = 'Time : ';
    }
}); 

buzzerBtn.addEventListener('click', () => {
    reactionTime = Date.now() - startTime;
    buzzerBtn.setAttribute('disabled', true);
    document.querySelector('#timer').textContent = 'Time : ' + reactionTime + 'ms';
    send();
});

function send() {
    socket.emit("client", {
        teamName: team.value,
        time: reactionTime
    });
}

let editBtn = document.querySelector('#edit-btn');
editBtn.addEventListener('click', () => {
    if(editBtn.textContent == 'Save') {
        editBtn.textContent = 'Edit';
        team.setAttribute('disabled',true);
    }
    else {
        editBtn.textContent = 'Save';
        team.removeAttribute('disabled');
    }
})