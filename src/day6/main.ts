import * as Logger from 'bunyan';

type Coordinates = { id: string, column: number, row: number }[];

export const findLimits = (coordinates: Coordinates): number[] => {
    const limits = [0, 0];
    coordinates.forEach(coordinate => {
        if (coordinate.column > limits[0]) {
            limits[0] = coordinate.column;
        }
        if (coordinate.row > limits[1]) {
            limits[1] = coordinate.row;
        }
    });
    return limits;
};

export const detectClosestCoordinate = (coordinates: Coordinates, column: number, row: number): string => {
    const distances = coordinates.map((coordinate) => {
        return {
            distance: Math.abs(coordinate.column - column) + Math.abs(coordinate.row - row),
            id: coordinate.id
        };
    }).sort((a, b) => {
        return a.distance < b.distance ? -1 : 1;
    });
    if (distances[0].distance === distances[1].distance) {
        return '.';
    }
    return distances[0].id;
};

export const mapGrid = (coordinates: Coordinates): string[] => {
    const limits = findLimits(coordinates);
    const grid = [];
    for (let row = 0; row <= limits[1]; row++) {
        let rowMap = '';
        for (let column = 0; column <= limits[0]; column++) {
            rowMap = rowMap + detectClosestCoordinate(coordinates, column, row);
        }
        grid.push(rowMap);
    }
    return grid;
};

export const findInfiniteAreas = (grid: string[]): string[] => {
    const infinites = [];
    grid.forEach((row, rowNumber) => {
        row.split('').forEach((location, locationNumber) => {
            if (!(rowNumber === 0 || rowNumber === (grid.length - 1) || locationNumber === 0 || locationNumber === (location.length - 1))) {
                return;
            }
            if (location === '+' || location === '.') {
                return;
            }
            if (infinites.indexOf(location) < 0) {
                infinites.push(location);
            }
        });
    });
    return infinites.sort();
};

export const findSizeOfLargestFiniteArea = (coordinates: Coordinates): number => {
    const grid = mapGrid(coordinates);
    const infinites = findInfiniteAreas(grid);
    let largest = {
        size: 0,
        id: ''
    };
    coordinates.forEach((coordinate) => {
        if (infinites.indexOf(coordinate.id) >= 0) {
            return;
        }
        let size = 0;
        grid.forEach(row => {
            const locations = row.split('');
            size += locations.filter(location => location === coordinate.id).length;
        });
        if (size > largest.size) {
            largest = {
                size: size,
                id: coordinate.id
            };
        }
    });
    return largest.size;
};

export const parse = (rawInputs: string[], _log: Logger): Coordinates => {
    const ids = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return rawInputs.map((input, index) => {
        const parts = input.split(', ');
        return {
            id: ids[index],
            column: parseInt(parts[0], 10),
            row: parseInt(parts[1], 10)
        }
    });
};

export const run1 = (coordinates: Coordinates, _log: Logger): number => {
    return findSizeOfLargestFiniteArea(coordinates);
};

export const calculateLocationSafeScore = (column: number, row: number, coordinates: Coordinates): number => {
    return coordinates.reduce((score, coordinate) => {
        return score + Math.abs(coordinate.column - column) + Math.abs(coordinate.row - row);
    }, 0);
};

export const countSafeLocations = (coordinates: Coordinates, safeScore: number): number => {
    const limits = findLimits(coordinates);
    let count = 0;
    for (let row = 0; row <= limits[1]; row++) {
        for (let column = 0; column <= limits[0]; column++) {
            if (calculateLocationSafeScore(column, row, coordinates) < safeScore) {
                count++;
            }
        }
    }
    return count;
};

export const run2 = (coordinates: Coordinates, _log: Logger): number => {
    return countSafeLocations(coordinates, 10000);
};
