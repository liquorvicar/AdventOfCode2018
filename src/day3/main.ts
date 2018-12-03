
export type Claim = {
    id: number;
    leftOffset: number;
    topOffset: number;
    width: number;
    height: number;
}

export const parseLine = (line: string): Claim => {
    // const input = '#1 @ 1,3: 4x4';
    const parts = line.match('#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)');
    return {
        id: parseInt(parts[1], 10),
        leftOffset: parseInt(parts[2], 10),
        topOffset: parseInt(parts[3], 10),
        width: parseInt(parts[4], 10),
        height: parseInt(parts[5], 10)
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

type Grid = {
    [K: number]: {
        [K: number]: number
    }
};

export const markSquaresCovered = (claim: Claim, grid: Grid) => {
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

export const countSquaresCovered = (grid: Grid): number => {
    let count = 0;
    for (const row in grid) {
        if (!grid.hasOwnProperty(row)) {
            continue;
        }
        for (const square in grid[row]) {
            if (grid[row][square] > 1) {
                count++;
            }
        }
    }
    return count;
};

export const findNonOverlappingClaim = (grid: Grid, claims: Claim[]): number => {
    const claim = claims.find(claim => {
        for (let y = claim.topOffset; y < (claim.topOffset + claim.height); y++) {
            if (grid[y] === undefined) {
                return false;
            }
            for (let x = claim.leftOffset; x < (claim.leftOffset + claim.width); x++) {
                if (grid[y][x] === undefined) {
                    return false
                }
                if (grid[y][x] !== 1) {
                    return false;
                }
            }
        }
        return true;
    });
    return claim ? claim.id : 0;
};

export const run2 = (claims: Claim[], _log) => {
    const grid = claims.reduce((grid, claim) => {
        return markSquaresCovered(claim, grid);
    }, {});
    return findNonOverlappingClaim(grid, claims);
};
