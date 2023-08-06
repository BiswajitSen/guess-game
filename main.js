const net = require('node:net');
const { initiateGame } = require('./src/guess-the-number');

const main = () => {
  const guessGameServer = new net.Server();
  initiateGame(guessGameServer, 5, 10);
  guessGameServer.listen(8085);
};

main();
