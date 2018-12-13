import Logger = require('bunyan');

export const calculatePowerLevel = (cell: { x: number; y: number }, serial: number): number => {
    const rackID = cell.x + 10;
    return (Math.floor(((rackID * cell.y) + serial) * rackID / 100) % 10) - 5;
};

export const calculateOptimalPowerLevels = (width: number, height: number, serial: number): { x: number; y: number } => {
    const grid = [];
    for (let y = 1; y <= height; y++) {
        const row = [];
        for (let x = 1; x <= width; x++) {
            row.push(calculatePowerLevel({ x, y }, serial));
        }
        grid.push(row);
    }
    const optimal = {
        topLeft: { x: 0, y: 0 },
        value: 0
    };
    for (let y = 1; y <= height - 2; y++) {
        const row = [];
        for (let x = 1; x <= width - 2; x++) {
            const power = grid[y - 1][x - 1] + grid[y - 1][x] + grid[y - 1][x + 1]
                + grid[y][x - 1] + grid[y][x] + grid[y][x + 1]
                + grid[y + 1][x - 1] + grid[y + 1][x] + grid[y + 1][x + 1];
            if (power > optimal.value) {
                optimal.topLeft = { x, y };
                optimal.value = power;
            }
        }
        grid.push(row);
    }
    return optimal.topLeft;
};

export const parse = (_rawInput, _log: Logger): number => {
    return 7511;
};

export const run1 = (serial: number, _log: Logger): { x: number, y: number } => {
    return calculateOptimalPowerLevels(300, 300, serial);
};
