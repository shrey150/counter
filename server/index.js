const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const path = require("path");

const port = process.env.PORT || 3000;

let count = 0;
let users = [];

app.use(express.static("client"));

app.get("/socket.io.js", (req, res) => {
    res.sendFile(path.join(__dirname, "../node_modules/"))
});

io.on("connection", socket => {

    users.push({ id: socket.id, name: "User", clicks: 0, lastClick: 0 });
    socket.emit("update", count);

    console.log(`User connected (total ${users.length})`);
    io.emit("updateTotalUsers", users.length);

    socket.on("count", data => {

        if (data === "+") count++;
        if (data === "-") count--;

        io.emit("update", count);

        addClick(socket.id);

        console.log(`Count: ${count}`);
        console.log(`Clicked by ${socket.id} (total clicks ${getUser(socket.id).clicks})`)

    });

    socket.on("disconnect", () => {
        users = users.filter(x => x.id !== socket.id);
        io.emit("updateTotalUsers", users.length);
        console.log(`User disconnected (total ${users.length})`);
    });

});

http.listen(port, () => {
    console.log(`server started on port ${port}`);
});

function addClick(id) {
    getUser(id).clicks++;
}

function getUser(id) {
    return users[getUserIndex(id)];
}

function getUserIndex(id) {

    let index = -1;

    for (let i = 0; i < users.length; i++)
        if (users[i].id === id) index = i;

    return index;

}