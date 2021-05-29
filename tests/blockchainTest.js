const Block = require("../blockchain/block");
const Blockchain = require("../blockchain/blockchain");

const blockchain = new Blockchain();

const time = [];
for (let i = 0; i < 100; i++) {
    const start = Date.now();
    blockchain.addBlock({ data: `block-${i}-${Math.random().toString(36)}` });
    time.push((Date.now() - start) / 1000);
    console.log(`block-${i} took : `, (Date.now() - start) / 1000);
}
const avgTime = time.reduce((total, val) => total + val) / time.length;
console.log(avgTime);
console.log(blockchain.chain);
