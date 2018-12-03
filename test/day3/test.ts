import test from 'ava';
import { Claim, countSquaresCovered, findNonOverlappingClaim, markSquaresCovered, parseLine } from '../../src/day3/main';

test('Parses input correctly', t => {
    const input = '#1 @ 1,3: 4x4';
    const expected: Claim = {
        id: 1,
        leftOffset: 1,
        topOffset: 3,
        width: 4,
        height: 4
    };
    t.deepEqual(parseLine(input), expected);
});

test('Marks inches covered by claim', t => {
    const claim: Claim = {
        id: 1,
        leftOffset: 1,
        topOffset: 3,
        width: 2,
        height: 4
    };
    const expected = {
        3: {
            1: 1,
            2: 1
        },
        4: {
            1: 1,
            2: 1
        },
        5: {
            1: 1,
            2: 1
        },
        6: {
            1: 1,
            2: 1
        }
    };
    t.deepEqual(markSquaresCovered(claim, {}), expected);
});

test('Count squares covered', t => {
    const grid = {
        1: {
            3: 1,
            4: 2,
            5: 2,
            6: 1
        },
        2: {
            3: 1,
            4: 2,
            5: 2,
            6: 1
        },
        3: {
            3: 1,
            4: 1,
            5: 1,
            6: 1
        },
        4: {
            3: 1,
            4: 1,
            5: 1,
            6: 1
        }
    };
    t.deepEqual(countSquaresCovered(grid), 4);
});

test('Sample data', t => {
    const claims = [
        '#1 @ 1,3: 4x4',
        '#2 @ 3,1: 4x4',
        '#3 @ 5,5: 2x2'
    ];
    const grid = claims.reduce((grid, claim) => {
        return markSquaresCovered(parseLine(claim), grid);
    }, {});
    t.is(countSquaresCovered(grid), 4);
});

test('Find claim that doesn\'t overlap', t => {
    const claims = [
        '#1 @ 1,3: 4x4',
        '#2 @ 3,1: 4x4',
        '#3 @ 5,5: 2x2'
    ].map(parseLine);
    const grid = claims.reduce((grid, claim) => {
        return markSquaresCovered(claim, grid);
    }, {});
    t.is(findNonOverlappingClaim(grid, claims), 3);
});
