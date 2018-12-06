import { test } from 'ava';
import {findAllTypes, findShortestPossiblePolymer, processReaction, reacts} from '../../src/day5/main';

test('Two different types do not react', t => {
    t.is(reacts('a', 'b'), false);
});

test('Two units of same polarity do not react', t => {
    t.is(reacts('a', 'a'), false);
});

test('Two units of same type but different polarity react', t => {
    t.is(reacts('a', 'A'), true);
});

const fullTests = [
    ['aA', ''],
    ['abBA', ''],
    ['abAB', 'abAB'],
    ['aabAAB', 'aabAAB'],
    ['dabAcCaCBAcCcaDA', 'dabCBAcaDA']
];

fullTests.forEach(testData => {
    test(testData[0], t => {
        t.is(processReaction(testData[0]), testData[1]);
    });
});

test('Find all types in polymer', t => {
    const polymer = 'dabAcCaCBAcCcaDA';
    t.deepEqual(findAllTypes(polymer), ['a', 'b', 'c', 'd']);
});

test('Find shortest possible polymer', t => {
    const polymer = 'dabAcCaCBAcCcaDA';
    t.deepEqual(findShortestPossiblePolymer(polymer), 4);
});
