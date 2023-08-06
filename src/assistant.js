const net = require('node:net');
const GAME_RESULTS = {
  correct: 0,
  high: 1,
  low: -1,
};

const generateRandomNumber = ({ upperLimit, lowerLimit }) =>
  Math.floor(lowerLimit + Math.random() * (upperLimit - lowerLimit));

const isNumberGreater = (gameResult) => gameResult === 1;
const isNumberSmaller = (gameResult) => gameResult === -1;
const hasGuessedCorrectly = (gameResult) => gameResult === 0;

const initiateAssistant = (assistant, upperLimit, lowerLimit = 0) => {
  assistant.on('connect', () => {
    assistant.setEncoding('utf-8');
    const guessThreshold = { upperLimit, lowerLimit };
    let lastGuess = undefined;

    const guessNumber = () => {
      lastGuess = generateRandomNumber(guessThreshold);
      assistant.write(`${lastGuess}`);
      console.log('guessed', lastGuess);
    };

    const updateThreshold = (gameResult) => {
      if (hasGuessedCorrectly(gameResult)) return;

      if (isNumberSmaller(gameResult)) {
        guessThreshold.lowerLimit = lastGuess + 1;
      }

      if (isNumberGreater(gameResult)) {
        guessThreshold.upperLimit = lastGuess - 1;
      }
    };

    const isValidResult = (result) => result in GAME_RESULTS;

    assistant.on('data', (gameResult) => {
      const gameResponse = GAME_RESULTS[gameResult];
      if (isValidResult(gameResult)) {
        updateThreshold(gameResponse);
        guessNumber();
      } else {
        console.log(gameResult);
      }
    });
    guessNumber();
  });
};

const main = () => {
  const assistant = net.createConnection(8085);
  initiateAssistant(assistant, 10, 0);
};

main();
