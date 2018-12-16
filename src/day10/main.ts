import * as Logger from 'bunyan';
import { writeFileSync } from 'fs';

type Point = {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
};

export const parse = (rawInputs: string[], _log: Logger): Point[] => {
    return rawInputs.map(input => {
        const parts = input.match('position=<[\\s]*([-0-9]*),[\\s]*([-0-9]*)> velocity=<[\\s]*([-0-9]*),[\\s]*([-0-9]*)>');
        return {
            x: parseInt(parts[1], 10),
            y: parseInt(parts[2], 10),
            velocityX: parseInt(parts[3], 10),
            velocityY: parseInt(parts[4], 10)
        };
    });
};

type Boundaries = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

export const findBoundaries = (points: Point[]): Boundaries => {
    const boundaries = {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    };
    return points.reduce((boundaries, point) => {
        if (point.x < boundaries.minX) {
            boundaries.minX = point.x;
        }
        if (point.x > boundaries.maxX) {
            boundaries.maxX = point.x;
        }
        if (point.y < boundaries.minY) {
            boundaries.minY = point.y;
        }
        if (point.y > boundaries.maxY) {
            boundaries.maxY = point.y;
        }
        return boundaries;
    }, boundaries);
};

export const generateOutput = (points: Point[]): string[] => {
    const boundaries = findBoundaries(points);
    const grid = [];
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
        const row = [];
        for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
            row.push('.');
        }
        grid.push(row);
    }
    return points.reduce((grid, point) => {
        const x = point.x - boundaries.minX;
        const y = point.y - boundaries.minY;
        grid[y][x] = '#';
        return grid;
    }, grid)
        .map(row => row.join(''));
};

export const movePoints = (points: Point[]): Point[] => {
    return points.map(point => {
        return {
            x: point.x + point.velocityX,
            y: point.y + point.velocityY,
            velocityX: point.velocityX,
            velocityY: point.velocityY
        };
    });
};

export const calculateTotalDistance = (points: Point[]): number => {
    return points.reduce((total, point) => {
        return total + points.reduce((distance, target) => {
            return distance + Math.abs(point.x - target.x) + Math.abs(point.y + target.y);
        }, 0);
    }, 0);
};

export const lowestTotalDistance = (points: Point[], maxIterations): { distance: number, seconds: number, points: Point[] } => {
    const lowest = {
        distance: 0,
        seconds: 0,
        points: []
    };
    for (let seconds = 1; seconds <= maxIterations; seconds++) {
        const totalDistance = calculateTotalDistance(points);
        if (lowest.distance === 0 || totalDistance < lowest.distance) {
            lowest.distance = totalDistance;
            lowest.seconds = seconds;
            lowest.points = points;
        }
        points = movePoints(points);
    }
    return lowest;
};

export const run1 = (points: Point[], _log: Logger) => {
    const lowest = lowestTotalDistance(points, 20000);
    writeFileSync('tmp.txt', generateOutput(lowest.points).join('\n'), { encoding: 'ascii' });
};


export const run2 = (points: Point[], _log: Logger): number => {
    const lowest = lowestTotalDistance(points, 20000);
    return lowest.seconds;
};
