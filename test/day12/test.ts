import { test } from 'ava';
import { runModel, sumPotsWithPlants } from '../../src/day12/main';
import * as Logger from 'bunyan';

const logger = Logger.createLogger({ name: 'day-12-tests' });
const allTestData = [
    { generation: 1, result: [{ pos: 0, pot: '#' }, { pos: 4, pot: '#' }, { pos: 9, pot: '#' }, { pos: 15, pot: '#' }, { pos: 18, pot: '#' }, { pos: 21, pot: '#' }, { pos: 24, pot: '#' }] },
    { generation: 2, result: [{ pos: 0, pot: '#' }, { pos: 1, pot: '#' }, { pos: 4, pot: '#' }, { pos: 5, pot: '#' }, { pos: 9, pot: '#' }, { pos: 10, pot: '#' }, { pos: 15, pot: '#' }, { pos: 18, pot: '#' }, { pos: 21, pot: '#' }, { pos: 24, pot: '#' }, { pos: 25, pot: '#' }] }
];

allTestData.forEach(testData => {
    test('Test after generation ' + testData.generation.toString(), t => {
        const initialState = '#..#.#..##......###...###...........';
        const rules = [
            { pattern: '...##', nextGeneration: '#' },
            { pattern: '..#..', nextGeneration: '#' },
            { pattern: '.#...', nextGeneration: '#' },
            { pattern: '.#.#.', nextGeneration: '#' },
            { pattern: '.#.##', nextGeneration: '#' },
            { pattern: '.##..', nextGeneration: '#' },
            { pattern: '.####', nextGeneration: '#' },
            { pattern: '#.#.#', nextGeneration: '#' },
            { pattern: '#.###', nextGeneration: '#' },
            { pattern: '##.#.', nextGeneration: '#' },
            { pattern: '##.##', nextGeneration: '#' },
            { pattern: '###..', nextGeneration: '#' },
            { pattern: '###.#', nextGeneration: '#' },
            { pattern: '####.', nextGeneration: '#' }
        ];
        t.deepEqual(runModel(initialState, rules, testData.generation, logger), testData.result);
    });
});

test('Sum points with plants', t => {
    const initialState = '#..#.#..##......###...###...........';
    const rules = [
        { pattern: '...##', nextGeneration: '#' },
        { pattern: '..#..', nextGeneration: '#' },
        { pattern: '.#...', nextGeneration: '#' },
        { pattern: '.#.#.', nextGeneration: '#' },
        { pattern: '.#.##', nextGeneration: '#' },
        { pattern: '.##..', nextGeneration: '#' },
        { pattern: '.####', nextGeneration: '#' },
        { pattern: '#.#.#', nextGeneration: '#' },
        { pattern: '#.###', nextGeneration: '#' },
        { pattern: '##.#.', nextGeneration: '#' },
        { pattern: '##.##', nextGeneration: '#' },
        { pattern: '###..', nextGeneration: '#' },
        { pattern: '###.#', nextGeneration: '#' },
        { pattern: '####.', nextGeneration: '#' }
    ];
    t.is(sumPotsWithPlants(initialState, rules, 20, logger), 325);
});
