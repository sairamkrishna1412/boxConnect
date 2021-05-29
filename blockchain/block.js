const { GENESIS_DATA, MINE_RATE, DIFFICULTY } = require("../config");
const cryptoHash = require("../utils/cryptoHash");

class Block {
    constructor({
        height,
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
    }) {
        this.height = height;
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis() {
        return new this(GENESIS_DATA);
    }
    static mineBlock({ lastBlock, data, difficulty }) {
        const lastHash = lastBlock.hash;
        const height = lastBlock.height + 1;
        let nonce = 0;
        let hash, timestamp;

        while (true) {
            timestamp = Date.now();
            // difficulty = Block.adjustDifficulty({
            //     originalBlock: lastBlock,
            //     timestamp,
            // });
            hash = cryptoHash(
                height,
                timestamp,
                lastHash,
                data,
                nonce,
                difficulty
            );
            if (hash.startsWith("0".repeat(difficulty))) {
                break;
            }
            nonce++;
        }
        return new this({
            height,
            timestamp,
            lastHash,
            data,
            nonce,
            difficulty,
            hash,
        });
    }
    // static adjustDifficulty({ originalBlock, timestamp }) {
    //     const { difficulty } = originalBlock;
    //     if (originalBlock.difficulty < 1) return 1;
    //     if (timestamp - originalBlock.timestamp > MINE_RATE) {
    //         return difficulty - 1;
    //     }
    //     return difficulty + 1;
    // }
}

module.exports = Block;
