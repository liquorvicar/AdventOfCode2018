import * as Logger from 'bunyan';
import { test } from 'ava';
import {
    getUnitsInTurnOrder,
    identifyTargets,
    findTargetsInRange,
    parse,
    Unit,
    findOpenLocations, State, findChosenTarget, takeAllTurns, attack, takeTurn, runCombat
} from '../../src/day15/main';

const logger = Logger.createLogger({ name: 'day-12-tests' });

test('Parses simple input', t => {
    const rawInput = [
        '#######',
        '#.G.E.#',
        '#E.G.E#',
        '#.G.E.#',
        '#######'
    ];
    const expected = {
        cavern: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 5, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 },
            { x: 4, y: 3 },
            { x: 5, y: 3 }
        ],
        units: [
            { type: 'Goblin', x: 2, y: 1, hitPoints: 200 },
            { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
            { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
            { type: 'Goblin', x: 3, y: 2, hitPoints: 200 },
            { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
            { type: 'Goblin', x: 2, y: 3, hitPoints: 200 },
            { type: 'Elf', x: 4, y: 3, hitPoints: 200 }
        ]
    };
    t.deepEqual(parse(rawInput, logger), expected);
});

test('Get units in turn order', t => {
    const units: Unit[] = [
        { type: 'Goblin', x: 2, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 3, hitPoints: 200 },
        { type: 'Goblin', x: 2, y: 3, hitPoints: 200 },
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Goblin', x: 3, y: 2, hitPoints: 200 }
    ];
    const sortedUnits = [
        { type: 'Goblin', x: 2, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Goblin', x: 3, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
        { type: 'Goblin', x: 2, y: 3, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 3, hitPoints: 200 }
    ];
    t.deepEqual(getUnitsInTurnOrder(units), sortedUnits);
});

test('Goblin identifies all Elf targets', t => {
    const units: Unit[] = [
        { type: 'Goblin', x: 2, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Goblin', x: 3, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
        { type: 'Goblin', x: 2, y: 3, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 3, hitPoints: 0 }
    ];
    const elves = [
        { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 5, y: 2, hitPoints: 200 }
    ];
    t.deepEqual(identifyTargets('Goblin', units), elves);
});

test('Unit is already in range of a target', t => {
    const goblin: Unit = { type: 'Goblin', x: 2, y: 2, hitPoints: 200 };
    const elves: Unit[] = [
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 2, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 2, y: 3, hitPoints: 200 },
        { type: 'Elf', x: 3, y: 2, hitPoints: 200 }
    ];
    const allElves = elves.slice();
    allElves.push({ type: 'Elf', x: 3, y: 3, hitPoints: 200 }, { type: 'Elf', x: 1, y: 1, hitPoints: 200 });
    t.deepEqual(findTargetsInRange(goblin, allElves), elves);
});

test('Find all open squares next to targets', t => {
    const elves: Unit[] = [
        { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
        { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
        { type: 'Elf', x: 4, y: 3, hitPoints: 200 }
    ];
    const state: State = {
        cavern: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 5, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 },
            { x: 4, y: 3 },
            { x: 5, y: 3 }
        ],
        units: [
            { type: 'Goblin', x: 2, y: 1, hitPoints: 200 },
            { type: 'Elf', x: 4, y: 1, hitPoints: 200 },
            { type: 'Elf', x: 1, y: 2, hitPoints: 200 },
            { type: 'Goblin', x: 3, y: 2, hitPoints: 200 },
            { type: 'Elf', x: 5, y: 2, hitPoints: 200 },
            { type: 'Goblin', x: 2, y: 3, hitPoints: 200 },
            { type: 'Elf', x: 4, y: 3, hitPoints: 200 }
        ]
    };
    const openLocations = [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 1 },
        { x: 2, y: 2 },
        { x: 4, y: 2 },
        { x: 1, y: 3 },
        { x: 3, y: 3 },
        { x: 5, y: 3 }
    ];
    t.deepEqual(findOpenLocations(elves, state), openLocations);
});

test('Find chosen target', t => {
    const state = parse([
        '#######',
        '#E..G.#',
        '#...#.#',
        '#.G.#G#',
        '#######'
    ], logger);
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const inRange = [
        { x: 3, y: 1 },
        { x: 5, y: 1 },
        { x: 2, y: 2 },
        { x: 5, y: 2 },
        { x: 1, y: 3 },
        { x: 3, y: 3 }
    ];
    const chosen = [{ x: 2, y: 1 }, { x: 3, y: 1 }];
    t.deepEqual(findChosenTarget(unit, inRange, state), chosen);
});

const exampleStates = [
    [
        '#########',
        '#G..G..G#',
        '#.......#',
        '#.......#',
        '#G..E..G#',
        '#.......#',
        '#.......#',
        '#G..G..G#',
        '#########'
    ],
    [
        '#########',
        '#.G...G.#',
        '#...G...#',
        '#...E..G#',
        '#.G.....#',
        '#.......#',
        '#G..G..G#',
        '#.......#',
        '#########'
    ],
    [
        '#########',
        '#..G.G..#',
        '#...G...#',
        '#.G.E.G.#',
        '#.......#',
        '#G..G..G#',
        '#.......#',
        '#.......#',
        '#########'
    ],
    [
        '#########',
        '#.......#',
        '#..GGG..#',
        '#..GEG..#',
        '#G..G...#',
        '#......G#',
        '#.......#',
        '#.......#',
        '#########'
    ]
];

const largerExampleTests = [
    [exampleStates[0], exampleStates[1]],
    [exampleStates[1], exampleStates[2]],
    [exampleStates[2], exampleStates[3]]
];

largerExampleTests.forEach((testData, testNumber) => {
    test(`Move all units ${testNumber}`, t => {
        const state = parse(testData[0], logger);
        const expected = parse(testData[1], logger);
        const finalState = takeAllTurns(state);
        finalState.state.units.forEach((finalUnit, unitNumber) => {
            t.is(finalUnit.x, expected.units[unitNumber].x);
            t.is(finalUnit.y, expected.units[unitNumber].y);
        })
    });
});

test('Does not attack with no adjacent units', t => {
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const units: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 3,
            y: 1,
            hitPoints: 100
        }
    ];
    t.deepEqual(attack(unit, units), units);
});

test('Attacks unit with one adjacent unit', t => {
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const units: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 100
        }
    ];
    const expected: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 97
        }
    ];
    t.deepEqual(attack(unit, units), expected);
});

test('Attacks unit with fewest hit points', t => {
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const units: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 100
        },
        {
            type: 'Goblin',
            x: 1,
            y: 2,
            hitPoints: 90
        }
    ];
    const expected: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 100
        },
        {
            type: 'Goblin',
            x: 1,
            y: 2,
            hitPoints: 87
        }
    ];
    t.deepEqual(attack(unit, units), expected);
});

test('Attacks unit with fewest hit points by reading order', t => {
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const units: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 1,
            y: 2,
            hitPoints: 100
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 100
        }
    ];
    const expected: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 1,
            y: 2,
            hitPoints: 100
        },
        {
            type: 'Goblin',
            x: 2,
            y: 1,
            hitPoints: 97
        }
    ];
    t.deepEqual(attack(unit, units), expected);
});

test('Unit takes no turn if it is dead', t => {
    const unit: Unit = {
        type: 'Elf',
        x: 1,
        y: 1,
        hitPoints: 0
    };
    const cavern = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 }
    ];
    const state: State = {
        cavern,
        units: [
            {
                type: 'Elf',
                x: 1,
                y: 1,
                hitPoints: 0
            },
            {
                type: 'Goblin',
                x: 1,
                y: 3,
                hitPoints: 100
            }
        ]
    };
    const expected: Unit[] = [
        {
            type: 'Elf',
            x: 1,
            y: 1,
            hitPoints: 0
        },
        {
            type: 'Goblin',
            x: 1,
            y: 3,
            hitPoints: 100
        }
    ];
    t.deepEqual(takeTurn(unit, state).units, expected);
});

test('Dead units are removed from the board', t => {
    const cavern = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 }
    ];
    const state: State = {
        cavern,
        units: [
            {
                type: 'Elf',
                x: 1,
                y: 1,
                hitPoints: 100
            },
            {
                type: 'Goblin',
                x: 1,
                y: 3,
                hitPoints: 3
            }
        ]
    };
    const expected: State = {
        cavern,
        units: [
            {
                type: 'Elf',
                x: 1,
                y: 2,
                hitPoints: 100
            }
        ]
    };
    t.deepEqual(takeAllTurns(state).state, expected);
});

test('We can detect if a unit has no targets', t => {
    const state: State = {
        cavern: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 1, y: 4 }
        ],
        units: [
            {
                type: 'Goblin',
                x: 1,
                y: 1,
                hitPoints: 100
            },
            {
                type: 'Goblin',
                x: 1,
                y: 3,
                hitPoints: 3
            },
            {
                type: 'Goblin',
                x: 1,
                y: 2,
                hitPoints: 3
            }
        ]
    };
    t.false(takeTurn(state.units[0], state).foundTarget);
});

const sampleFullCombats = [
    {
        grid: [
            '#######',
            '#.G...#',
            '#...EG#',
            '#.#.#G#',
            '#..G#E#',
            '#.....#',
            '#######'
        ],
        turns: 47,
        remainingHitPoints: 590
    },
    {
        grid: [
            '#######',
            '#G..#E#',
            '#E#E.E#',
            '#G.##.#',
            '#...#E#',
            '#...E.#',
            '#######'
        ],
        turns: 37,
        remainingHitPoints: 982
    },
    {
        grid: [
            '#######',
            '#E..EG#',
            '#.#G.E#',
            '#E.##E#',
            '#G..#.#',
            '#..E#.#',
            '#######'
        ],
        turns: 46,
        remainingHitPoints: 859
    },
    {
        grid: [
            '#######',
            '#E.G#.#',
            '#.#G..#',
            '#G.#.G#',
            '#G..#.#',
            '#...E.#',
            '#######'
        ],
        turns: 35,
        remainingHitPoints: 793
    },
    {
        grid: [
            '#######',
            '#.E...#',
            '#.#..G#',
            '#.###.#',
            '#E#G#G#',
            '#...#G#',
            '#######'
        ],
        turns: 54,
        remainingHitPoints: 536
    },
    {
        grid: [
            '#########',
            '#G......#',
            '#.E.#...#',
            '#..##..G#',
            '#...##..#',
            '#...#...#',
            '#.G...G.#',
            '#.....G.#',
            '#########'
        ],
        turns: 20,
        remainingHitPoints: 937
    }
];

sampleFullCombats.forEach((testData, testNumber) => {
    test(`Full sample combat ${testNumber}`, t => {
        const state = parse(testData.grid, logger);
        const expected = {
            turns: testData.turns,
            remainingHitPoints: testData.remainingHitPoints
        };
        t.deepEqual(runCombat(state, logger), expected);
        t.deepEqual(runCombat(state, logger), expected);
    });
})
