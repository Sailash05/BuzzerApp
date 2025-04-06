const socket = io("http://192.168.1.5:4000");

let startTime;
let buzzerBtn = document.querySelector('#buzzer-btn');
buzzerBtn.setAttribute('disabled', true);

socket.on("admin", (data) => {
    if(data == 'UNLOCK') {
        buzzerBtn.removeAttribute('disabled');
        startTime = Date.now();
        document.querySelector('#timer').textContent = 'Time : ';
    }
}); 

buzzerBtn.addEventListener('click', () => {
    const reactionTime = Date.now() - startTime;
    buzzerBtn.setAttribute('disabled', true);
    document.querySelector('#timer').textContent = 'Time : ' + reactionTime + 'ms';
});

function send() {
    socket.emit("client", document.querySelector('input').value);
}

let editBtn = document.querySelector('#edit-btn');
editBtn.addEventListener('click', () => {
    if(editBtn.textContent == 'Save') {
        editBtn.textContent = 'Edit';
    }
})