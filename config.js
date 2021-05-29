const DIFFICULTY = 4;
const MINE_RATE = 1000;
const GENESIS_DATA = {
    height: 0,
    timestamp: Date.now(),
    lastHash: 0,
    hash: "gensis",
    difficulty: DIFFICULTY,
    nonce: 0,
    data: ["always last"],
};

module.exports = { GENESIS_DATA, MINE_RATE };
