import Logger = require('bunyan');

export const calculatePowerLevel = (cell: { x: number; y: number }, serial: number): number => {
    const rackID = cell.x + 10;
    return (Math.floor(((rackID * cell.y) + serial) * rackID / 100) % 10) - 5;
};

export const calculateOptimalPowerLevels = (serial: number, minSize: number, maxSize: number): { topLeft: { x: number, y: number }, value: number, size: number } => {
    const grid = [];
    for (let y = 1; y <= 300; y++) {
        const row = [];
        for (let x = 1; x <= 300; x++) {
            row.push(calculatePowerLevel({ x, y }, serial));
        }
        grid.push(row);
    }
    const optimal = {
        topLeft: { x: 0, y: 0 },
        value: 0,
        size: 0
    };
    for (let y = 1; y <= 300; y++) {
        const row = [];
        for (let x = 1; x <= 300; x++) {
            const thisMaxSize = Math.min(301 - x, 301 - y, maxSize);
            for (let size = minSize; size <= thisMaxSize; size++) {
                let power = 0;
                for (let width = 1; width <= size; width++) {
                    for (let height = 1; height <= size; height++) {
                        power += grid[y + height - 2][x + width - 2];
                    }
                }
                if (power > optimal.value) {
                    optimal.topLeft = { x, y };
                    optimal.value = power;
                    optimal.size = size;
                }
            }
        }
        grid.push(row);
    }
    return optimal;
};

export const parse = (_rawInput, _log: Logger): number => {
    return 7511;
};

export const run1 = (serial: number, _log: Logger): { x: number, y: number } => {
    return calculateOptimalPowerLevels(serial, 3, 3).topLeft;
};

export const run2 = (serial: number, _log: Logger): any => {
    return calculateOptimalPowerLevels(serial, 1, 300);
};
