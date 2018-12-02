import test from 'ava';
import {countRepeatedLetters, hasLetterThreeTimes, hasLetterTwice} from "../../src/day2/main";

test('has no letter repeated twice',  t => {
    t.false(hasLetterTwice('abcdef'));
});

test('has letter repeated twice',  t => {
    t.true(hasLetterTwice('abbcde'));
});

test('has letter repeated three times not twice',  t => {
    t.false(hasLetterTwice('abcccd'));
});

test('has no letter repeated three times',  t => {
    t.false(hasLetterThreeTimes('abcdef'));
});

test('has no letter repeated three times',  t => {
    t.false(hasLetterThreeTimes('abbcde'));
});

test('has letter repeated three times', t => {
    t.true(hasLetterThreeTimes('abcccd'));
});

test('has letter repeated twice and letter repeated three times', t => {
    t.true(hasLetterTwice('bababc'));
    t.true(hasLetterThreeTimes('bababc'));
});

test('counts strings with letters repeated twice and three times', t => {
    const strings = [
        'abcdef',
        'bababc',
        'abbcde',
        'abcccd',
        'aabcdd',
        'abcdee',
        'ababab'
    ];
    const expected = {
        2: 4,
        3: 3
    };
    t.deepEqual(countRepeatedLetters(strings), expected);
})