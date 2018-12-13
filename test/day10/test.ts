import { test } from 'ava';
import { findBoundaries, generateOutput, lowestTotalDistance, movePoints, parse } from '../../src/day10/main';

test('Parsing the point data', t => {
    const rawInputs = [
        'position=< 9,  1> velocity=< 0,  2>',
        'position=< 3, -2> velocity=<-1,  1>',
        'position=< 6, 10> velocity=<-2, -1>',
        'position=< 2, -4> velocity=< 2,  2>',
        'position=<-6, 10> velocity=< 2, -2>'
    ];
    const expected = [
        { x: 9, y: 1, velocityX: 0, velocityY: 2 },
        { x: 3, y: -2, velocityX: -1, velocityY: 1 },
        { x: 6, y: 10, velocityX: -2, velocityY: -1 },
        { x: 2, y: -4, velocityX: 2, velocityY: 2 },
        { x: -6, y: 10, velocityX: 2, velocityY: -2 }
    ];
    t.deepEqual(parse(rawInputs, null), expected);
});

test('Output points', t => {
    const points = [
        { x: 9, y: 1, velocityX: 0, velocityY: 2 },
        { x: 3, y: -2, velocityX: -1, velocityY: 1 },
        { x: 6, y: 10, velocityX: -2, velocityY: -1 },
        { x: 2, y: -4, velocityX: 2, velocityY: 2 },
        { x: -6, y: 10, velocityX: 2, velocityY: -2 }
    ];
    t.deepEqual(findBoundaries(points), { minX: -6, maxX: 9, minY: -4, maxY: 10 });
});

test('Output points', t => {
    const points = [
        { x: 9, y: 1, velocityX: 0, velocityY: 2 },
        { x: 3, y: -2, velocityX: -1, velocityY: 1 },
        { x: 6, y: 10, velocityX: -2, velocityY: -1 },
        { x: 2, y: -4, velocityX: 2, velocityY: 2 },
        { x: -6, y: 10, velocityX: 2, velocityY: -2 }
    ];
    const expected = [
        '........#.......', // -4
        '................', // -3
        '.........#......', // -2
        '................', // -1
        '................', //  0
        '...............#', //  1
        '................', //  2
        '................', //  3
        '................', //  4
        '................', //  5
        '................', //  6
        '................', //  7
        '................', //  8
        '................', //  9
        '#...........#...'  // 10
    ];
    t.deepEqual(generateOutput(points), expected);
});

test('Points after one second', t => {
    const points = [
        { x: 9, y: 1, velocityX: 0, velocityY: 2 },
        { x: 3, y: -2, velocityX: -1, velocityY: 1 },
        { x: 6, y: 10, velocityX: -2, velocityY: -1 },
        { x: 2, y: -4, velocityX: 2, velocityY: 2 },
        { x: -6, y: 10, velocityX: 2, velocityY: -2 }
    ];
    const expected = [
        { x: 9, y: 3, velocityX: 0, velocityY: 2 },
        { x: 2, y: -1, velocityX: -1, velocityY: 1 },
        { x: 4, y: 9, velocityX: -2, velocityY: -1 },
        { x: 4, y: -2, velocityX: 2, velocityY: 2 },
        { x: -4, y: 8, velocityX: 2, velocityY: -2 }
    ];
    t.deepEqual(movePoints(points), expected);
});

test('Check lowest total distance between points', t => {
    const points = [
        { x: 9, y: 1, velocityX: 0, velocityY: 2 },
        { x: 3, y: -2, velocityX: -1, velocityY: 1 },
        { x: 6, y: 10, velocityX: -2, velocityY: -1 },
        { x: 2, y: -4, velocityX: 2, velocityY: 2 },
        { x: -6, y: 10, velocityX: 2, velocityY: -2 }
    ];
    t.is(lowestTotalDistance(points, 10).seconds, 3);
});
