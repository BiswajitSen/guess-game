const generateRandomNumber = (upperLimit, lowerLimit = 0) =>
  lowerLimit + Math.floor(Math.random() * (upperLimit - lowerLimit));

const guessIsLarger = (numberToGuess, guess) => numberToGuess < guess;
const guessIsSmaller = (numberToGuess, guess) => numberToGuess > guess;
const hasGuessedCorrectly = (numberToGuess, guess) => numberToGuess === guess;

const noAttemptsLeft = (chances) => chances === 0;

const generateMessage = (numberToGuess, guess) => {
  switch (true) {
    case hasGuessedCorrectly(numberToGuess, guess):
      return 'correct';
    case guessIsLarger(numberToGuess, guess):
      return 'high';
    case guessIsSmaller(numberToGuess, guess):
      return 'low';
  }
};

const initiateGame = (gameServer, chances, threshold) => {
  gameServer.on('connection', (socket) => {
    console.log('new client got connected.');
    socket.setEncoding('utf-8');

    let chancesLeft = chances;
    const numberToGuess = generateRandomNumber(threshold);

    socket.on('data', (guess) => {
      chancesLeft--;
      console.log('guess', guess);

      if (hasGuessedCorrectly(numberToGuess, +guess)) {
        socket.write('You Won !!!');
        console.log('Guess is correct.');
        socket.end();
        return;
      }

      if (noAttemptsLeft(chancesLeft)) {
        let lostMessage = 'you lost !!!';
        lostMessage += ' correct number' + ' ' + numberToGuess + '\n';

        socket.write(lostMessage);
        socket.end();
        return;
      }

      const message = generateMessage(numberToGuess, guess);
      socket.write(message);
    });
  });
};

// const main = () => {
//   const guessGameServer = new net.Server();
//   initiateGame(guessGameServer, 5, 10);
//   guessGameServer.listen(8085);
// };

// main();

module.exports = {
  initiateGame,
};
