import { test } from 'ava';
import { calculatePowerLevel, calculateOptimalPowerLevels } from '../../src/day11/main';

const powerLevels = [
    { cell: { x: 3, y: 5 }, serial: 8, powerLevel: 4 },
    { cell: { x: 122, y: 79 }, serial: 57, powerLevel: -5 },
    { cell: { x: 217, y: 196 }, serial: 39, powerLevel: 0 },
    { cell: { x: 101, y: 153 }, serial: 71, powerLevel: 4 }
];

powerLevels.forEach((testData, testNum) => {
    test('Calculate power level ' + testNum, t => {
        t.is(calculatePowerLevel(testData.cell, testData.serial), testData.powerLevel);
    });
});


test('Calculate optimal power area', t => {
    t.deepEqual(calculateOptimalPowerLevels(42, 3, 3).topLeft, { x: 21, y: 61 });
});

test('Calculate optimal power area for non-fixed grid', t => {
    const optimalPowerLevels = calculateOptimalPowerLevels(18, 1, 20);
    t.deepEqual(optimalPowerLevels.topLeft, { x: 90, y: 269 });
    t.is(optimalPowerLevels.size, 16);
});
