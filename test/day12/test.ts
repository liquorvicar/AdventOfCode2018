import { test } from 'ava';
import { runModel, sumPotsWithPlants } from '../../src/day12/main';

const allTestData = [
    { generation: 1, result: { state: '..#...#....#.....#..#..#..#...........', start: -2 } },
    { generation: 2, result: { state: '..##..##...##....#..#..#..##..........', start: -2 } },
    { generation: 3, result: { state: '..#.#...#..#.#....#..#..#...#..........', start: -3 } },
    { generation: 16, result: { state: '..#.#..#...#.#...##...#...#.#..##..##...', start: -4 } },
    { generation: 20, result: { state: '..#....##....#####...#######....#.#..##.', start: -4 } }
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
        t.deepEqual(runModel(initialState, rules, testData.generation), testData.result);
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
    t.is(sumPotsWithPlants(initialState, rules, 20), 325);
});
