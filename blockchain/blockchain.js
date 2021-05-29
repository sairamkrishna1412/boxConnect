const Block = require("./block");
const { MINE_RATE, DIFFICULTY } = require("../config");
const cryptoHash = require("../utils/cryptoHash");
class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }
    addBlock({ data }) {
        // if(this.chain[this.chain.length-1].timestamp - this.chain[this.chain.length-2].timestamp );
        const lastBlock = this.chain[this.chain.length - 1];
        let difficulty = lastBlock.difficulty;
        if (this.chain.length % 10 == 0 && this.chain.length > 0) {
            const chainLength = this.chain.length;
            const slicedChain = this.chain.slice(chainLength - 10, chainLength);
            difficulty = this._adjustDifficulty({ chain: slicedChain });
        }
        const minedBlock = Block.mineBlock({
            lastBlock,
            data,
            difficulty,
        });
        this.chain.push(minedBlock);
    }
    _adjustDifficulty({ chain }) {
        const difference =
            chain[chain.length - 1].timestamp - chain[0].timestamp;
        const difficulty = chain[chain.length - 1].difficulty;
        if (difference < MINE_RATE * 10) {
            return difficulty + 1;
        }
        return difficulty - 1;
    }
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let b = 1; b < chain.length; b++) {
            const {
                timestamp,
                lastHash,
                data,
                hash,
                nonce,
                difficulty,
                height,
            } = chain[b];
            //check if lastHash is equal to previous block hash
            if (lastHash !== chain[b - 1].hash) {
                return false;
            }
            //re-calculate curelements hash. cryptoHash will return a different hash if any of data, timestamp or lastHash is modified.
            const validatedHash = cryptoHash(
                timestamp,
                data,
                lastHash,
                nonce,
                difficulty,
                height
            );

            //check if updated hash is equal to hash before updated.
            if (validatedHash !== hash) {
                return false;
            }
        }
        return true;
    }
    replaceChain(chain) {
        const actualChain = this.chain;
        if (chain.length <= actualChain.length) {
            console.error("The incoming chain is shorter than original chain");
            return;
        }
        if (!this.constructor.isValidChain(chain)) {
            console.error("The incoming chain is invalid");
            return;
        }
        console.log("Replacing chain with", chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;
