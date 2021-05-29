const Blockchain = require("../blockchain/blockchain");
const Block = require("../blockchain/block");

describe("Blockchain", () => {
    let blockchain, newChain, originalChain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });
    const gensisBlock = Block.genesis();
    it("is an Array object", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    it("starts with genesis block", () => {
        expect(blockchain.chain[0]).toEqual(gensisBlock);
    });
    it("adds a block to blockchain", () => {
        const newData = "foo";
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
            newData
        );
    });

    describe("isValidChain()", () => {
        describe("when chain does not start with genesis block", () => {
            it("return false", () => {
                blockchain.chain[0] = { data: "invalid genesis" };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe("when chain starts with genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock({ data: "shiva" });
                blockchain.addBlock({ data: "sai" });
                blockchain.addBlock({ data: "roopesh" });
            });
            describe("when `lastHash` reference is changed", () => {
                it("return false", () => {
                    blockchain.chain[3].lastHash = "fake-hash";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("when block fields are tampered", () => {
                it("return false", () => {
                    blockchain.chain[3].data = "fake-data";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("when all blocks are valid", () => {
                it("return true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        true
                    );
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe("when new chain is shorter than original chain", () => {
            beforeEach(() => {
                blockchain.replaceChain(newChain.chain);
            });
            it("does not replace chain", () => {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("when new chain is longer than original chain", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "qq" });
                newChain.addBlock({ data: "bakk" });
                newChain.addBlock({ data: "edd" });
            });
            describe("when new chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].data = "bakka";
                    blockchain.replaceChain(newChain.chain);
                });
                it("does not replace chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe("when new chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it("replaces original chain", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it("log new chain", () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});
