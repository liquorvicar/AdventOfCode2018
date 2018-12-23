import { test } from 'ava';
import {
    addi,
    addr,
    bani,
    banr,
    bori,
    borr,
    eqir, eqri, eqrr, findMatchingOpcodes,
    gtir,
    gtri,
    gtrr,
    muli,
    mulr,
    seti,
    setr
} from '../../src/day16/main';

test('addr', t => {
    const registers = { 0: 2, 1: 3, 2: 0, 3: 0 };
    const expected = { 0: 2, 1: 3, 2: 0, 3: 5 };
    t.deepEqual(addr(1, 0, 3, registers), expected);
});

test('addi', t => {
    const registers = { 0: 2, 1: 3, 2: 0, 3: 0 };
    const expected = { 0: 2, 1: 3, 2: 8, 3: 0 };
    t.deepEqual(addi(1, 5, 2, registers), expected);
});

test('mulr', t => {
    const registers = { 0: 2, 1: 1, 2: 3, 3: 3 };
    const expected = { 0: 9, 1: 1, 2: 3, 3: 3 };
    t.deepEqual(mulr(2, 3, 0, registers), expected);
});

test('muli', t => {
    const registers = { 0: 2, 1: 1, 2: 3, 3: 0 };
    const expected = { 0: 2, 1: 6, 2: 3, 3: 0 };
    t.deepEqual(muli(0, 3, 1, registers), expected);
});

test('banr', t => {
    const registers = { 0: 12, 1: 10, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 10, 2: 8, 3: 0 };
    t.deepEqual(banr(0, 1, 2, registers), expected);
});

test('bani', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 8, 3: 0 };
    t.deepEqual(bani(0, 10, 2, registers), expected);
});

test('borr', t => {
    const registers = { 0: 12, 1: 10, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 10, 2: 14, 3: 0 };
    t.deepEqual(borr(0, 1, 2, registers), expected);
});

test('bori', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 14, 3: 0 };
    t.deepEqual(bori(0, 10, 2, registers), expected);
});

test('setr', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 12, 3: 0 };
    t.deepEqual(setr(0, 1, 2, registers), expected);
});

test('seti', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 5, 3: 0 };
    t.deepEqual(seti(5, 1, 2, registers), expected);
});

test('gtir', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 1, 3: 0 };
    t.deepEqual(gtir(15, 0, 2, registers), expected);
});

test('gtri', t => {
    const registers = { 0: 15, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 15, 1: 0, 2: 1, 3: 0 };
    t.deepEqual(gtri(0, 12, 2, registers), expected);
});

test('gtrr', t => {
    const registers = { 0: 15, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 15, 1: 0, 2: 1, 3: 0 };
    t.deepEqual(gtrr(0, 1, 2, registers), expected);
});


test('eqir', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 1, 3: 0 };
    t.deepEqual(eqir(12, 0, 2, registers), expected);
});

test('eqri', t => {
    const registers = { 0: 12, 1: 0, 2: 0, 3: 0 };
    const expected = { 0: 12, 1: 0, 2: 1, 3: 0 };
    t.deepEqual(eqri(0, 12, 2, registers), expected);
});

test('eqrr', t => {
    const registers = { 0: 17, 1: 17, 2: 0, 3: 0 };
    const expected = { 0: 17, 1: 17, 2: 1, 3: 0 };
    t.deepEqual(eqrr(0, 1, 2, registers), expected);
});

test('Finds all matching opcodes', t => {
    const before = { 0: 3, 1: 2, 2: 1, 3: 1 };
    const instruction = [9, 2, 1, 2];
    const after = { 0: 3, 1: 2, 2: 2, 3: 1 };
    t.is(findMatchingOpcodes(before, instruction, after), 3);
});
