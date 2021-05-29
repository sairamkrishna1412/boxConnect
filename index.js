const express = require("express");
const Blockchain = require("./blockchain/blockchain");

const app = express();
const blockchain = new Blockchain();

app.get("/api/blocks", (req, res) => {
    res.json({
        status: "success",
        data: blockchain,
    });
});

const PORT = 3000;
app.listen(PORT, (err) => {
    // if (err) {
    //     console.log(err);
    // } else {
    //     console.log(`listening to requests at ${PORT}`);
    // }
    console.log(`listening to requests at ${PORT}`);
});
