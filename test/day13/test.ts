import { test } from 'ava';
import {
    Cart,
    findFirstCrash,
    findLastCartLocation,
    getCartsInOrder,
    moveCart,
    parse,
    State,
    tick,
    Track
} from '../../src/day13/main';
import * as Logger from 'bunyan';

const logger = Logger.createLogger({ name: 'day-12-tests' });

test('Parses simple input', t => {
    const rawInput = [
        '|',
        'v',
        '|',
        '|',
        '|',
        '^',
        '|'
    ];
    const expected = {
        tracks: [
            { x: 0, y: 0, track: '|' },
            { x: 0, y: 1, track: '|' },
            { x: 0, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 0, y: 4, track: '|' },
            { x: 0, y: 5, track: '|' },
            { x: 0, y: 6, track: '|' }
        ],
        carts: [
            { x: 0, y: 1, direction: 'S' },
            { x: 0, y: 5, direction: 'N' }
        ]
    };
    t.deepEqual(parse(rawInput, null), expected);
});

test('Moves carts', t => {
    const initial: State = {
        tracks: [
            { x: 0, y: 0, track: '|' },
            { x: 0, y: 1, track: '|' },
            { x: 0, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 0, y: 4, track: '|' },
            { x: 0, y: 5, track: '|' },
            { x: 0, y: 6, track: '|' }
        ],
        carts: [
            { x: 0, y: 1, direction: 'S' },
            { x: 0, y: 5, direction: 'N' }
        ]
    };
    const expected: State = {
        tracks: [
            { x: 0, y: 0, track: '|' },
            { x: 0, y: 1, track: '|' },
            { x: 0, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 0, y: 4, track: '|' },
            { x: 0, y: 5, track: '|' },
            { x: 0, y: 6, track: '|' }
        ],
        carts: [
            { x: 0, y: 2, direction: 'S' },
            { x: 0, y: 4, direction: 'N' }
        ],
        crash: undefined
    };
    t.deepEqual(tick(initial, logger), expected);
});

test('Moving carts returns crash location if there is a crash', t => {
    const initial: State = {
        tracks: [
            { x: 0, y: 0, track: '|' },
            { x: 0, y: 1, track: '|' },
            { x: 0, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 0, y: 4, track: '|' },
            { x: 0, y: 5, track: '|' },
            { x: 0, y: 6, track: '|' }
        ],
        carts: [
            { x: 0, y: 2, direction: 'S' },
            { x: 0, y: 4, direction: 'N' }
        ]
    };
    const expected = {
        x: 0,
        y: 3
    };
    t.deepEqual(tick(initial, logger).crash, expected);
});

test('Parse more complicated track', t => {
    const input = [
        '/->-\\        ',
        '|   |  /----\\',
        '| /-+--+-\\  |',
        '| | |  | v  |',
        '\\-+-/  \\-+--/',
        '  \\------/   '
    ];
    const state = {
        carts: [
            { x: 2, y: 0, direction: 'E' },
            { x: 9, y: 3, direction: 'S' }
        ],
        tracks: [
            { x: 0, y: 0, track: '/' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '\\' },
            { x: 0, y: 1, track: '|' },
            { x: 4, y: 1, track: '|' },
            { x: 7, y: 1, track: '/' },
            { x: 8, y: 1, track: '-' },
            { x: 9, y: 1, track: '-' },
            { x: 10, y: 1, track: '-' },
            { x: 11, y: 1, track: '-' },
            { x: 12, y: 1, track: '\\' },
            { x: 0, y: 2, track: '|' },
            { x: 2, y: 2, track: '/' },
            { x: 3, y: 2, track: '-' },
            { x: 4, y: 2, track: '+' },
            { x: 5, y: 2, track: '-' },
            { x: 6, y: 2, track: '-' },
            { x: 7, y: 2, track: '+' },
            { x: 8, y: 2, track: '-' },
            { x: 9, y: 2, track: '\\' },
            { x: 12, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 2, y: 3, track: '|' },
            { x: 4, y: 3, track: '|' },
            { x: 7, y: 3, track: '|' },
            { x: 9, y: 3, track: '|' },
            { x: 12, y: 3, track: '|' },
            { x: 0, y: 4, track: '\\' },
            { x: 1, y: 4, track: '-' },
            { x: 2, y: 4, track: '+' },
            { x: 3, y: 4, track: '-' },
            { x: 4, y: 4, track: '/' },
            { x: 7, y: 4, track: '\\' },
            { x: 8, y: 4, track: '-' },
            { x: 9, y: 4, track: '+' },
            { x: 10, y: 4, track: '-' },
            { x: 11, y: 4, track: '-' },
            { x: 12, y: 4, track: '/' },
            { x: 2, y: 5, track: '\\' },
            { x: 3, y: 5, track: '-' },
            { x: 4, y: 5, track: '-' },
            { x: 5, y: 5, track: '-' },
            { x: 6, y: 5, track: '-' },
            { x: 7, y: 5, track: '-' },
            { x: 8, y: 5, track: '-' },
            { x: 9, y: 5, track: '/' }
        ]
    };
    t.deepEqual(parse(input, null), state);
});

const testData: { initialCart: Cart, tracks: Track[], expectedCart: Cart }[] = [
    { initialCart: { x: 1, y: 1, direction: 'N' }, tracks: [{ x: 1, y: 0, track: '|' }], expectedCart: { x: 1, y: 0, direction: 'N' } },
    { initialCart: { x: 1, y: 1, direction: 'S' }, tracks: [{ x: 1, y: 2, track: '|' }], expectedCart: { x: 1, y: 2, direction: 'S' } },
    { initialCart: { x: 1, y: 1, direction: 'E' }, tracks: [{ x: 2, y: 1, track: '-' }], expectedCart: { x: 2, y: 1, direction: 'E' } },
    { initialCart: { x: 1, y: 1, direction: 'W' }, tracks: [{ x: 0, y: 1, track: '-' }], expectedCart: { x: 0, y: 1, direction: 'W' } },
    { initialCart: { x: 1, y: 1, direction: 'W' }, tracks: [{ x: 0, y: 1, track: '/' }], expectedCart: { x: 0, y: 1, direction: 'S' } },
    { initialCart: { x: 1, y: 1, direction: 'N' }, tracks: [{ x: 1, y: 0, track: '/' }], expectedCart: { x: 1, y: 0, direction: 'E' } },
    { initialCart: { x: 1, y: 1, direction: 'S' }, tracks: [{ x: 1, y: 2, track: '/' }], expectedCart: { x: 1, y: 2, direction: 'W' } },
    { initialCart: { x: 1, y: 1, direction: 'E' }, tracks: [{ x: 2, y: 1, track: '/' }], expectedCart: { x: 2, y: 1, direction: 'N' } },
    { initialCart: { x: 1, y: 1, direction: 'W' }, tracks: [{ x: 0, y: 1, track: '\\' }], expectedCart: { x: 0, y: 1, direction: 'N' } },
    { initialCart: { x: 1, y: 1, direction: 'N' }, tracks: [{ x: 1, y: 0, track: '\\' }], expectedCart: { x: 1, y: 0, direction: 'W' } },
    { initialCart: { x: 1, y: 1, direction: 'S' }, tracks: [{ x: 1, y: 2, track: '\\' }], expectedCart: { x: 1, y: 2, direction: 'E' } },
    { initialCart: { x: 1, y: 1, direction: 'E' }, tracks: [{ x: 2, y: 1, track: '\\' }], expectedCart: { x: 2, y: 1, direction: 'S' } },
    { initialCart: { x: 1, y: 1, direction: 'S' }, tracks: [{ x: 1, y: 2, track: '+' }], expectedCart: { x: 1, y: 2, direction: 'E', intersections: 1 } },
    { initialCart: { x: 1, y: 1, direction: 'E' }, tracks: [{ x: 2, y: 1, track: '+' }], expectedCart: { x: 2, y: 1, direction: 'N', intersections: 1 } },
    { initialCart: { x: 1, y: 1, direction: 'E', intersections: 1 }, tracks: [{ x: 2, y: 1, track: '+' }], expectedCart: { x: 2, y: 1, direction: 'E', intersections: 2 } },
    { initialCart: { x: 1, y: 1, direction: 'E', intersections: 2 }, tracks: [{ x: 2, y: 1, track: '+' }], expectedCart: { x: 2, y: 1, direction: 'S', intersections: 3 } }
];

testData.forEach((data, index) => {
    test('Moves cart in right direction ' + index.toString(), t => {
        t.deepEqual(moveCart(data.initialCart, data.tracks), data.expectedCart);
    });
});

test('Find first crash', t => {
    const state: State = {
        carts: [
            { x: 2, y: 0, direction: 'E' },
            { x: 9, y: 3, direction: 'S' }
        ],
        tracks: [
            { x: 0, y: 0, track: '/' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '\\' },
            { x: 0, y: 1, track: '|' },
            { x: 4, y: 1, track: '|' },
            { x: 7, y: 1, track: '/' },
            { x: 8, y: 1, track: '-' },
            { x: 9, y: 1, track: '-' },
            { x: 10, y: 1, track: '-' },
            { x: 11, y: 1, track: '-' },
            { x: 12, y: 1, track: '\\' },
            { x: 0, y: 2, track: '|' },
            { x: 2, y: 2, track: '/' },
            { x: 3, y: 2, track: '-' },
            { x: 4, y: 2, track: '+' },
            { x: 5, y: 2, track: '-' },
            { x: 6, y: 2, track: '-' },
            { x: 7, y: 2, track: '+' },
            { x: 8, y: 2, track: '-' },
            { x: 9, y: 2, track: '\\' },
            { x: 12, y: 2, track: '|' },
            { x: 0, y: 3, track: '|' },
            { x: 2, y: 3, track: '|' },
            { x: 4, y: 3, track: '|' },
            { x: 7, y: 3, track: '|' },
            { x: 9, y: 3, track: '|' },
            { x: 12, y: 3, track: '|' },
            { x: 0, y: 4, track: '\\' },
            { x: 1, y: 4, track: '-' },
            { x: 2, y: 4, track: '+' },
            { x: 3, y: 4, track: '-' },
            { x: 4, y: 4, track: '/' },
            { x: 7, y: 4, track: '\\' },
            { x: 8, y: 4, track: '-' },
            { x: 9, y: 4, track: '+' },
            { x: 10, y: 4, track: '-' },
            { x: 11, y: 4, track: '-' },
            { x: 12, y: 4, track: '/' },
            { x: 2, y: 5, track: '\\' },
            { x: 3, y: 5, track: '-' },
            { x: 4, y: 5, track: '-' },
            { x: 5, y: 5, track: '-' },
            { x: 6, y: 5, track: '-' },
            { x: 7, y: 5, track: '-' },
            { x: 8, y: 5, track: '-' },
            { x: 9, y: 5, track: '/' }
        ]
    };
    t.deepEqual(findFirstCrash(state, logger), { x: 7, y: 3 });
});

test('Return sorted carts as is', t => {
    const carts: Cart[] = [
        { x: 5, y: 0, direction: 'N' },
        { x: 5, y: 1, direction: 'N' }
    ];
    t.deepEqual(getCartsInOrder(carts), carts);
});

test('Sort carts by row first', t => {
    const carts: Cart[] = [
        { x: 3, y: 1, direction: 'N' },
        { x: 5, y: 0, direction: 'N' }
    ];
    const sortedCarts: Cart[] = [
        { x: 5, y: 0, direction: 'N' },
        { x: 3, y: 1, direction: 'N' }
    ];
    t.deepEqual(getCartsInOrder(carts), sortedCarts);
});

test('Sort carts by column second', t => {
    const carts: Cart[] = [
        { x: 7, y: 0, direction: 'N' },
        { x: 5, y: 0, direction: 'N' }
    ];
    const sortedCarts: Cart[] = [
        { x: 5, y: 0, direction: 'N' },
        { x: 7, y: 0, direction: 'N' }
    ];
    t.deepEqual(getCartsInOrder(carts), sortedCarts);
});

test('Horizontal tracks moving west', t => {
    const initialState: State = {
        tracks: [
            { x: 0, y: 0, track: '-' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '-' },
            { x: 5, y: 0, track: '-' }
        ],
        carts: [
            { x: 2, y: 0, direction: 'W' },
            { x: 1, y: 0, direction: 'W' }
        ]
    };
    const expectedState: State = {
        tracks: [
            { x: 0, y: 0, track: '-' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '-' },
            { x: 5, y: 0, track: '-' }
        ],
        carts: [
            { x: 0, y: 0, direction: 'W' },
            { x: 1, y: 0, direction: 'W' }
        ],
        crash: undefined
    };
    t.deepEqual(tick(initialState, logger), expectedState);
});

test('Horizontal tracks moving east', t => {
    const initialState: State = {
        tracks: [
            { x: 0, y: 0, track: '-' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '-' },
            { x: 5, y: 0, track: '-' }
        ],
        carts: [
            { x: 2, y: 0, direction: 'E' },
            { x: 1, y: 0, direction: 'E' }
        ]
    };
    t.deepEqual(tick(initialState, logger).crash, { x: 2, y: 0 });
});


test('Simple horizontal head-on crash detection', t => {
    const initialState: State = {
        tracks: [
            { x: 0, y: 0, track: '-' },
            { x: 1, y: 0, track: '-' },
            { x: 2, y: 0, track: '-' },
            { x: 3, y: 0, track: '-' },
            { x: 4, y: 0, track: '-' },
            { x: 5, y: 0, track: '-' }
        ],
        carts: [
            { x: 3, y: 0, direction: 'W' },
            { x: 1, y: 0, direction: 'E' }
        ]
    };
    t.deepEqual(tick(initialState, logger).crash, { x: 2, y: 0 });
});

test('Find location of final cart', t => {
    const input = [
        '/>-<\\  ',
        '|   |  ',
        '| /<+-\\',
        '| | | v',
        '\\>+</ |',
        '  |   ^',
        '  \\<->/'
    ];
    const state = parse(input, logger);
    t.deepEqual(findLastCartLocation(state, logger), { x: 6, y: 4 });
});
