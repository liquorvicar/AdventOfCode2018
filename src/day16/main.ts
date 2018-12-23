import * as clonedeep from 'lodash.clonedeep';
import Logger = require('bunyan');

type Registers = {
    0: number;
    1: number;
    2: number;
    3: number;
}

interface OpCode {
    (A: number, B: number, C: number, registers: Registers): Registers;
}

export const addr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] + registers[B];
    return registers;
};

export const addi: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] + B;
    return registers;
};

export const mulr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] * registers[B];
    return registers;
};

export const muli: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] * B;
    return registers;
};

export const banr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] & registers[B];
    return registers;
};

export const bani: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] & B;
    return registers;
};

export const borr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] | registers[B];
    return registers;
};

export const bori: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] | B;
    return registers;
};

export const setr: OpCode = (A, _B, C, registers) => {
    registers[C] = registers[A];
    return registers;
};

export const seti: OpCode = (A, _B, C, registers) => {
    registers[C] = A;
    return registers;
};

export const gtir: OpCode = (A, B, C, registers) => {
    registers[C] = A > registers[B] ? 1 : 0;
    return registers;
};

export const gtri: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] > B ? 1 : 0;
    return registers;
};

export const gtrr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] > registers[B] ? 1 : 0;
    return registers;
};

export const eqir: OpCode = (A, B, C, registers) => {
    registers[C] = A === registers[B] ? 1 : 0;
    return registers;
};

export const eqri: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] === B ? 1 : 0;
    return registers;
};

export const eqrr: OpCode = (A, B, C, registers) => {
    registers[C] = registers[A] === registers[B] ? 1 : 0;
    return registers;
};

const opCodes: OpCode[] = [
    addr,
    addi,
    mulr,
    muli,
    banr,
    bani,
    borr,
    bori,
    setr,
    seti,
    gtir,
    gtri,
    gtrr,
    eqir,
    eqri,
    eqrr
];

const matches = (register: Registers, after: Registers): boolean => {
    return register['0'] === after['0']
        && register['1'] === after['1']
        && register['2'] === after['2']
        && register['3'] === after['3'];
};

export const findMatchingOpcodes = (before: Registers, instruction: number[], after: Registers): number => {
    return opCodes.reduce((count, opCode) => {
        let register = clonedeep(before);
        register = opCode(instruction[1], instruction[2], instruction[3], register);
        if (matches(register, after)) {
            count++;
        }
        return count;
    }, 0);
};

export const parse = (rawInput: string[], _log: Logger): string[] => {
    return rawInput;
};

const parseRegister = (line: string): Registers => {
    const matches = line.match('\\[([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\\]');
    return {
        0: parseInt(matches[1], 10),
        1: parseInt(matches[2], 10),
        2: parseInt(matches[3], 10),
        3: parseInt(matches[4], 10)
    };
};

const parseInstruction = (line: string): number[] => {
    const matches = line.match('([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)');
    return matches.slice(1).map(parsedNumber => parseInt(parsedNumber, 10));
};

export const run1 = (input: string[], _log: Logger): number => {
    let before;
    let after;
    let instruction;
    let count = 0;
    input.forEach(line => {
        if (line.startsWith('Before')) {
            before = parseRegister(line.replace('Before: ', ''));
        } else if (line.startsWith('After')) {
            after = parseRegister(line.replace('After: ', ''));
        } else {
            instruction = parseInstruction(line);
        }
        if (before && instruction && after) {
            if (findMatchingOpcodes(before, instruction, after) >= 3) {
                count++;
            }
            before = null;
            after = null;
            instruction = null;
        }
    });
    return count;
};
