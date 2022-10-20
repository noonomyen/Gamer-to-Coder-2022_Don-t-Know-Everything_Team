const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
    console.log(`Request from ${req.socket.remoteAddress} - GET / - index.html`);
    res.sendFile("./index.html", { root: __dirname });
});

app.listen(port, () => {
    console.log(`[${Date()}] app listening on port ${port}`);
});