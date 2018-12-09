import Logger = require('bunyan');

type GameBoard = {
    marbles: number[];
    current: number;
    scores: { [K: number]: number };
    nextPlayer: number;
    nextMarble: number;
};

export const playTurn = (gameBoard: GameBoard, numPlayers: number, _log: Logger): GameBoard => {
    if (gameBoard.marbles.length < 2) {
        gameBoard.marbles.push(gameBoard.nextMarble);
        gameBoard.current = gameBoard.marbles.length - 1;
    } else if (gameBoard.nextMarble % 23 === 0) {
        if (gameBoard.scores[gameBoard.nextPlayer] === undefined) {
            gameBoard.scores[gameBoard.nextPlayer] = 0;
        }
        gameBoard.scores[gameBoard.nextPlayer] += gameBoard.nextMarble;
        let newPos = gameBoard.current - 7;
        if (newPos < 0) {
            newPos += gameBoard.marbles.length;
        }
        gameBoard.scores[gameBoard.nextPlayer] += gameBoard.marbles[newPos];
        const currentMarbles = gameBoard.marbles;
        gameBoard.marbles = currentMarbles.slice(0, newPos)
            .concat(currentMarbles.slice(newPos + 1));
        gameBoard.current = newPos;
    } else {
        let newPos = gameBoard.current + 2;
        if (newPos > gameBoard.marbles.length) {
            newPos -= gameBoard.marbles.length;
        }
        const currentMarbles = gameBoard.marbles;
        gameBoard.marbles = currentMarbles.slice(0, newPos)
            .concat([gameBoard.nextMarble])
            .concat(currentMarbles.slice(newPos));
        gameBoard.current = newPos;
    }
    gameBoard.nextPlayer++;
    if (gameBoard.nextPlayer > numPlayers) {
        gameBoard.nextPlayer = 1;
    }
    gameBoard.nextMarble++;
    return gameBoard;
};

export const runGame = (numPlayers: number, lastMarble: number, log: Logger): number => {
    let gameBoard = {
        marbles: [0],
        current: 0,
        scores: {},
        nextPlayer: 1,
        nextMarble: 1
    };
    while (gameBoard.nextMarble <= lastMarble) {
        if (gameBoard.nextMarble % 10000 ===0) {
            log.info({ marble: gameBoard.nextMarble, total: lastMarble }, 'Running...');
        }
        gameBoard = playTurn(gameBoard, numPlayers, log);
    }
    let highScore = 0;
    for (const score in gameBoard.scores) {
        if (!gameBoard.scores.hasOwnProperty(score)) {
            continue;
        }
        highScore = gameBoard.scores[score] > highScore ? gameBoard.scores[score] : highScore;
    }
    return highScore;
};

export const parse = (_raw, _log: Logger) => {
    return [412, 71646];
};

export const run1 = (input: number[], log: Logger): number => {
    return runGame(input[0], input[1], log);
};

export const run2 = (input: number[], log: Logger): number => {
    return runGame(input[0], input[1] * 100, log);
};
