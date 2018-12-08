import { test } from 'ava';
import { parseNumbers, sumMetadata, calculateValue } from '../../src/day8/main';

test('Parse single node', t => {
    const numbers = [0, 1, 99];
    const node = {
        children: [],
        metadata: [99]
    };
    t.deepEqual(parseNumbers(numbers), node);
});

test('Parse node with one child', t => {
    const numbers = [1, 1, 0, 1, 99, 2];
    const node = {
        children: [
            {
                children: [],
                metadata: [99]
            }
        ],
        metadata: [2]
    };
    t.deepEqual(parseNumbers(numbers), node);
});

test('Parse example tree', t => {
    const numbers = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2];
    const node = {
        children: [
            {
                children: [],
                metadata: [10, 11, 12]
            },
            {
                children: [
                    {
                        children: [],
                        metadata: [99]
                    }
                ],
                metadata: [2]
            }
        ],
        metadata: [1, 1, 2]
    };
    t.deepEqual(parseNumbers(numbers), node);
});

test('Sum all metadata', t => {
    const node = {
        children: [
            {
                children: [],
                metadata: [10, 11, 12]
            },
            {
                children: [
                    {
                        children: [],
                        metadata: [99]
                    }
                ],
                metadata: [2]
            }
        ],
        metadata: [1, 1, 2]
    };
    t.is(sumMetadata(node, 0), 138);
});

test('Calculate value of Node with no referenced children', t => {
    const node = {
        children: [
            {
                children: [],
                metadata: [99]
            }
        ],
        metadata: [2]
    };
    t.is(calculateValue(node, 0), 0);
});


test('Calculate value of Node with referenced children', t => {
    const node = {
        children: [
            {
                children: [],
                metadata: [10, 11, 12]
            },
            {
                children: [
                    {
                        children: [],
                        metadata: [99]
                    }
                ],
                metadata: [2]
            }
        ],
        metadata: [1, 1, 2]
    };
    t.is(calculateValue(node, 0), 66);
});
