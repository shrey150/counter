const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const path = require("path");

const port = process.env.PORT || 3000;

let count = 0;

app.use(express.static("client"));

app.get("/socket.io.js", (req, res) => {
    res.sendFile(path.join(__dirname, "../node_modules/"))
});

io.on("connection", socket => {

    console.log("User connected!");
    socket.emit("update", count);

    socket.on("count", data => {

        if (data === "+") count++;
        if (data === "-") count--;

        io.emit("update", count);
        console.log(`Count: ${count}`);

    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
    });

});

http.listen(port, () => {
    console.log(`server started on port ${port}`);
});