import { test } from 'ava';
import { playTurn, runGame } from '../../src/day9/main';
import { createLogger } from 'bunyan';

const log = createLogger({ name: 'AoC2018-4-tests', level: 'debug' });

let initialGameBoard = {
    marbles: [0],
    current: 0,
    scores: {},
    nextPlayer: 1,
    nextMarble: 1
};
const expected = [
    {
        marbles: [0, 1],
        current: 1,
        scores: {},
        nextPlayer: 2,
        nextMarble: 2
    },
    {
        marbles: [0, 2, 1],
        current: 1,
        scores: {},
        nextPlayer: 3,
        nextMarble: 3
    },
    {
        marbles: [0, 2, 1, 3],
        current: 3,
        scores: {},
        nextPlayer: 4,
        nextMarble: 4
    },
    {
        marbles: [0, 4, 2, 1, 3],
        current: 1,
        scores: {},
        nextPlayer: 5,
        nextMarble: 5
    },
    {
        marbles: [0, 4, 2, 5, 1, 3],
        current: 3,
        scores: {},
        nextPlayer: 6,
        nextMarble: 6
    },
    {
        marbles: [0, 4, 2, 5, 1, 6, 3],
        current: 5,
        scores: {},
        nextPlayer: 7,
        nextMarble: 7
    },
    {
        marbles: [0, 4, 2, 5, 1, 6, 3, 7],
        current: 7,
        scores: {},
        nextPlayer: 8,
        nextMarble: 8
    },
    {
        marbles: [0, 8, 4, 2, 5, 1, 6, 3, 7],
        current: 1,
        scores: {},
        nextPlayer: 9,
        nextMarble: 9
    },
    {
        marbles: [0, 8, 4, 9, 2, 5, 1, 6, 3, 7],
        current: 3,
        scores: {},
        nextPlayer: 1,
        nextMarble: 10
    }
];

expected.forEach((endGameBoard, key) => {
    test('Place marble: ' + (key + 1), t => {
        t.deepEqual(playTurn(initialGameBoard, 9, log), endGameBoard);
        initialGameBoard = endGameBoard;
    });
});

test('Calculates points', t => {
    const initialGameBoard = {
        marbles: [0, 16, 8, 17, 4, 18, 9, 19, 2, 20, 10, 21, 5, 22, 11, 1, 12, 6, 13, 3, 14, 7, 15],
        current: 13,
        scores: {},
        nextPlayer: 5,
        nextMarble: 23
    };
    const expected = {
        marbles: [0, 16, 8, 17, 4, 18, 19, 2, 20, 10, 21, 5, 22, 11, 1, 12, 6, 13, 3, 14, 7, 15],
        current: 6,
        scores: { 5: 32 },
        nextPlayer: 6,
        nextMarble: 24
    };
    t.deepEqual(playTurn(initialGameBoard, 9, log), expected);
});

test('Find high score at end of game', t => {
    t.is(runGame(9, 25, log), 32);
});

const highScores = [
    [10, 1618, 8317],
    [13, 7999, 146373],
    [17, 1104, 2764],
    [21, 6111, 54718],
    [30, 5807, 37305]
];

highScores.forEach(highScore => {
    test(`High score for ${highScore[0]} players after marble ${highScore[1]}`, t => {
        t.is(runGame(highScore[0], highScore[1], log), highScore[2]);
    })
});
