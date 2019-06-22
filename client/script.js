console.log("Client loaded!");

const socket = io();

socket.on("update", data => {
    document.querySelector("#count").innerHTML = data;
});

socket.on("updateTotalUsers", n => {
    document.querySelector("#totalUsers").innerHTML = `Total players: ${n}`;
});

function count(mode) { socket.emit("count", mode) }

window.addEventListener("keydown", e => {

    if (e.repeat) return;

    switch (e.key) {

        case "-":
            count("-");
            break;

        case "=":
        case "+":
            count("+");
            break;
        
        default:
            break;

    }

});