import { test } from 'ava';
import {
    calculateLocationSafeScore, countSafeLocations,
    detectClosestCoordinate,
    findInfiniteAreas,
    findLimits,
    findSizeOfLargestFiniteArea,
    mapGrid, parse
} from '../../src/day6/main';

test('Calculate limits of grid', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.deepEqual(findLimits(coordinates), [8, 9]);
});

test('Detect closest coordinate to square', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(detectClosestCoordinate(coordinates, 7, 4), 'C');
});

test('Detect closest coordinate to square if square is a coordinate', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(detectClosestCoordinate(coordinates, 3, 4), 'D');
});

test('Detect multiple closest coordinates to square', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(detectClosestCoordinate(coordinates, 0, 4), '.');
});

test('Map grid', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    const expected = [
        'AAAAA.CCC',
        'AAAAA.CCC',
        'AAADDECCC',
        'AADDDECCC',
        '..DDDEECC',
        'BB.DEEEEC',
        'BBB.EEEE.',
        'BBB.EEEFF',
        'BBB.EEFFF',
        'BBB.FFFFF'
    ];
    t.deepEqual(mapGrid(coordinates), expected);
});

test('Find infinite areas', t => {
    const grid = [
        'AAAAA.CCC',
        'AAAAA.CCC',
        'AAADDECCC',
        'AADDDECCC',
        '..DDDEECC',
        'BB.DEEEEC',
        'BBB.EEEE.',
        'BBB.EEEFF',
        'BBB.EEFFF',
        'BBB.FFFFF'
    ];
    t.deepEqual(findInfiniteAreas(grid), ['A', 'B', 'C', 'F']);
});

test('Find size of largest finite area', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(findSizeOfLargestFiniteArea(coordinates), 17);
});

test('Parse input', t => {
    const input = [
        '1, 1',
        '1, 6',
        '8, 3',
        '3, 4',
        '5, 5',
        '8, 9'
    ];
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.deepEqual(parse(input, null), coordinates);
});

test('Calculate location safe score', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(calculateLocationSafeScore(4, 3, coordinates), 30);
});

test('Count safe locations', t => {
    const coordinates = [
        { id: 'A', column: 1, row: 1 },
        { id: 'B', column: 1, row: 6 },
        { id: 'C', column: 8, row: 3 },
        { id: 'D', column: 3, row: 4 },
        { id: 'E', column: 5, row: 5 },
        { id: 'F', column: 8, row: 9 }
    ];
    t.is(countSafeLocations(coordinates, 32), 16);
});
