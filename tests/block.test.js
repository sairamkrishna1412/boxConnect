const Block = require("../blockchain/block");
const { GENESIS_DATA, MINE_RATE, DIFFICULTY } = require("../config");
const cryptoHash = require("../utils/cryptoHash");

describe("Block", () => {
    const timestamp = 2000;
    const lastHash = "last-hash";
    const hash = "cur-hash";
    const data = "block data";
    const nonce = 1;
    const difficulty = 1;
    const height = 0;
    const block = new Block({
        height,
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
    });

    it("has timestamp, lastHash, hash and data", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.height).toEqual(height);
    });
    describe("gensis()", () => {
        const gensisBlock = Block.genesis();

        it("returns a Block", () => {
            expect(gensisBlock instanceof Block).toBe(true);
        });
        it("return genesis data", () => {
            expect(gensisBlock).toEqual(GENESIS_DATA);
        });
    });
    describe("mineBlock()", () => {
        const lastBlock = Block.genesis();
        const data = "data";
        const minedBlock = Block.mineBlock({
            lastBlock,
            data,
        });
        const difficulty = minedBlock.difficulty;
        const hash = cryptoHash(
            minedBlock.lastHash,
            minedBlock.data,
            minedBlock.timestamp,
            minedBlock.nonce,
            minedBlock.difficulty,
            minedBlock.height
        );
        it("returns a Block", () => {
            expect(minedBlock instanceof Block).toBe(true);
        });
        it("minedBlock `lastHash` equal to previous block `hash`", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it("sets the `data`", () => {
            expect(minedBlock.data).toEqual(data);
        });
        it("block has a `timestamp`", () => {
            expect(minedBlock.timestamp).not.toBe(undefined);
        });
        it("generates a sha-256 hash", () => {
            expect(minedBlock.hash).toEqual(hash);
        });
        it("returns a difficulty passed block", () => {
            let difficultyString = "";
            for (let i = 0; i < difficulty; i++) {
                difficultyString += "0";
            }
            expect(minedBlock.hash.startsWith(difficultyString)).toBe(true);
        });
        // it("adjustDifficulty()", () => {
        //     const validDifficulties = [
        //         lastBlock.difficulty + 1,
        //         lastBlock.difficulty - 1,
        //     ];
        //     expect(validDifficulties.includes(minedBlock.difficulty)).toBe(
        //         true
        //     );
        // });
    });
    // describe("adjustDifficulty()", () => {
    //     it("mined block faster than mine rate, increase difficulty", () => {
    //         expect(
    //             Block.adjustDifficulty({
    //                 originalBlock: block,
    //                 timestamp: block.timestamp + MINE_RATE - 100,
    //             })
    //         ).toEqual(block.difficulty + 1);
    //     });
    //     it("mined block slower than mine rate, decrease difficulty", () => {
    //         expect(
    //             Block.adjustDifficulty({
    //                 originalBlock: block,
    //                 timestamp: block.timestamp + MINE_RATE + 100,
    //             })
    //         ).toEqual(block.difficulty - 1);
    //     });
    //     it("minimun difficulty is 1", () => {
    //         block.difficulty = -1;
    //         expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    //     });
    // });
});
