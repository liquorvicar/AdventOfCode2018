import * as Logger from 'bunyan';

export type State = {
    tracks: Track[];
    carts: Cart[];
    crash?: CrashLocation;
};

type Direction = 'N' | 'S' | 'E' | 'W';

export type Cart = {
    x: number;
    y: number;
    direction: Direction;
    intersections?: number;
}

export type Track = {
    x: number;
    y: number;
    track: '|' | '-' | '\\' | '/' | '+';
}

type CrashLocation = {
    x: number;
    y: number;
}

export const parse = (rawInput: string[], _log: Logger): State => {
    return rawInput.reduce((map, row, rowNum) => {
        row.split('').forEach((location, colNum) => {
            if (location !== ' ') {
                const track = { x: colNum, y: rowNum, track: location };
                if (location === '^') {
                    map.carts.push({ x: colNum, y: rowNum, direction: 'N' });
                    track.track = '|';
                } else if (location === 'v') {
                    map.carts.push({ x: colNum, y: rowNum, direction: 'S' });
                    track.track = '|';
                } else if (location === '>') {
                    map.carts.push({ x: colNum, y: rowNum, direction: 'E' });
                    track.track = '-';
                } else if (location === '<') {
                    map.carts.push({ x: colNum, y: rowNum, direction: 'W' });
                    track.track = '-';
                }
                map.tracks.push(track);
            }
        });
        return map;
    }, { tracks: [], carts: [] });
};

export const getCartsInOrder = (carts: Cart[]): Cart[] => {
    return carts.sort((a, b) => {
        if (a.y < b.y) {
            return -1;
        } else if (b.y < a.y) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        }
        return 1;
    });
};

export const tick = (initial: State, log: Logger): State => {
    const newState: State = {
        tracks: initial.tracks,
        carts: [],
        crash: initial.crash
    };
    initial.carts = getCartsInOrder(initial.carts);
    while (initial.carts.length > 0) {
        let cart = initial.carts.shift();
        cart = moveCart(cart, initial.tracks);
        if (cart.x === 16 && cart.y === 45) {
            log.info('Are you sure you haven\'t crashed?');
        }
        if (initial.carts.find(existingCart => existingCart.x === cart.x && existingCart.y === cart.y)) {
            newState.crash = newState.crash || { x: cart.x, y: cart.y };
            log.info({ x: cart.x, y: cart.y }, 'Crash!');
        } else if (!newState.crash && newState.carts.find(existingCart => existingCart.x === cart.x && existingCart.y === cart.y)) {
            newState.crash = newState.crash || { x: cart.x, y: cart.y };
            log.info({ x: cart.x, y: cart.y }, 'Crash!');
        }
        newState.carts.push(cart);
    }
    return newState;
};

const directionChanges = {
    '/': {
        N: 'E',
        S: 'W',
        E: 'N',
        W: 'S'
    },
    '\\': {
        N: 'W',
        S: 'E',
        E: 'S',
        W: 'N'
    }
};

const directions: Direction[] = ['N', 'E', 'S', 'W'];

export const moveCart = (cart: Cart, tracks: Track[]): Cart => {
    if (cart.direction === 'N') {
        cart.y--;
    } else if (cart.direction === 'S') {
        cart.y++;
    } else if (cart.direction === 'E') {
        cart.x++;
    } else if (cart.direction === 'W') {
        cart.x--;
    }
    const newLocation = tracks.find(location => location.x === cart.x && location.y === cart.y);
    if (directionChanges[newLocation.track]) {
        cart.direction = directionChanges[newLocation.track][cart.direction];
    } else if (newLocation.track === '+') {
        if (!cart.intersections) {
            cart.intersections = 0;
        }
        const directionChoice = cart.intersections % 3;
        const current = directions.indexOf(cart.direction);
        if (directionChoice === 0) {
            cart.direction = directions[(current - 1 + 4) % 4];
        } else if (directionChoice === 2) {
            cart.direction = directions[(current + 1) % 4];
        }
        cart.intersections++;
    }
    return cart;
};

export const findFirstCrash = (state: State, log: Logger): CrashLocation => {
    do {
        state = tick(state, log);
    } while (!state.crash);
    return state.crash;
};

export const run1 = (state: State, log: Logger): CrashLocation => {
    return findFirstCrash(state, log);
};
