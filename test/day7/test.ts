import { test } from 'ava';
import { calculateStepOrder, detectNextStep, parse, StepTree } from '../../src/day7/main';

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
