
export type Claim = {
    id: number;
    leftOffset: number;
    topOffset: number;
    width: number;
    height: number;
}

export const parseLine = (line: string): Claim => {
    // const input = '#1 @ 1,3: 4x4';
    const parts = line.match(`#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)`);
    return {
        id: parseInt(parts[1]),
        leftOffset: parseInt(parts[2]),
        topOffset: parseInt(parts[3]),
        width: parseInt(parts[4]),
        height: parseInt(parts[5])
    };
};

export const parse = (rawInputs, _log) => {
    return rawInputs.map(parseLine);
};

export const run1 = (claims: Claim[], _log) => {
    const grid = claims.reduce((grid, claim) => {
        return markSquaresCovered(claim, grid);
    }, {});
    return countSquaresCovered(grid);
};

export const markSquaresCovered = (claim: Claim, grid: { [K: number]: { [K: number]: number }}) => {
    for (let y = claim.topOffset; y < (claim.topOffset + claim.height); y++) {
        if (grid[y] === undefined) {
            grid[y] = {};
        }
        for (let x = claim.leftOffset; x < (claim.leftOffset + claim.width); x++) {
            if (grid[y][x] === undefined) {
                grid[y][x] = 0;
            }
            grid[y][x]++;
        }
    }
    return grid;
};

export const countSquaresCovered = (grid: { [K: number]: { [K: number]: number }}): number => {
    let count = 0;
    for (const row in grid) {
        for (const square in grid[row]) {
            if (grid[row][square] > 1) {
                count++;
            }
        }
    }
    return count;
};
