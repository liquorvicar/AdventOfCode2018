import { test } from 'ava';
import {
    calculateStepOrder,
    detectNextStep,
    parse,
    StepTree,
    allocateWorkers,
    processAllSteps
} from '../../src/day7/main';
import { createLogger } from 'bunyan';

const log = createLogger({ name: 'AoC2018-4-tests', level: 'debug' });

test('Parses input correctly', t => {
    const input = [
        'Step C must be finished before step A can begin.',
        'Step C must be finished before step F can begin.',
        'Step A must be finished before step B can begin.',
        'Step A must be finished before step D can begin.',
        'Step B must be finished before step E can begin.',
        'Step D must be finished before step E can begin.',
        'Step F must be finished before step E can begin.'
    ];
    const expected: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    t.deepEqual(parse(input, null), expected);
});

test('Detect next step with one possible step', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    t.is(detectNextStep(tree), 'C');
});

test('Detect next step with two possible steps', t => {
    const tree: StepTree = {
        A: [],
        B: ['A'],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: []
    };
    t.is(detectNextStep(tree), 'A');
});

test('Calculate order of steps', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    t.is(calculateStepOrder(tree), 'CABDFE');
});

test('Allocate workers in second 0', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    const workers = [
        {
            task: '',
            timeLeft: 0
        },
        {
            task: '',
            timeLeft: 0
        }
    ];
    const expected = [
        {
            task: 'C',
            timeLeft: 2
        },
        {
            task: '',
            timeLeft: 0
        }

    ];
    t.deepEqual(allocateWorkers(tree, workers, 0), expected);
});

test('Allocate workers in second 1', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    const workers = [
        {
            task: 'C',
            timeLeft: 2
        },
        {
            task: '',
            timeLeft: 0
        }
    ];
    const expected = [
        {
            task: 'C',
            timeLeft: 1
        },
        {
            task: '',
            timeLeft: 0
        }

    ];
    t.deepEqual(allocateWorkers(tree, workers, 0), expected);
});

test('Allocate workers in second 3 (with overhead)', t => {
    const tree: StepTree = {
        A: [],
        B: ['A'],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: []
    };
    const workers = [
        {
            task: '',
            timeLeft: 0
        },
        {
            task: '',
            timeLeft: 0
        }
    ];
    const expected = [
        {
            task: 'A',
            timeLeft: 60
        },
        {
            task: 'F',
            timeLeft: 65
        }
    ];
    t.deepEqual(allocateWorkers(tree, workers, 60), expected);
});

test('Only 2nd worker is free', t => {
    const tree: StepTree = {
        A: [],
        B: ['A'],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: []
    };
    const workers = [
        {
            task: 'A',
            timeLeft: 2
        },
        {
            task: '',
            timeLeft: 0
        }
    ];
    const expected = [
        {
            task: 'A',
            timeLeft: 1
        },
        {
            task: 'F',
            timeLeft: 65
        }
    ];
    t.deepEqual(allocateWorkers(tree, workers, 60), expected);
});

test('Count seconds to process all steps', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['A'],
        C: [],
        D: ['A'],
        E: ['B', 'D', 'F'],
        F: ['C']
    };
    const workers = [
        {
            task: '',
            timeLeft: 0
        },
        {
            task: '',
            timeLeft: 0
        }
    ];
    t.is(processAllSteps(tree, workers, 0, log), 15);
});

test('Count seconds to process single step', t => {
    const tree: StepTree = {
        C: []
    };
    const workers = [
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 }
    ];
    t.is(processAllSteps(tree, workers, 60, log), 63);
});

test('Count seconds to process 6 steps', t => {
    const tree: StepTree = {
        A: ['C'],
        B: ['C'],
        C: [],
        D: ['C'],
        E: ['C'],
        F: ['C']
    };
    const workers = [
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 }
    ];
    t.is(processAllSteps(tree, workers, 60, log), 129);
});
