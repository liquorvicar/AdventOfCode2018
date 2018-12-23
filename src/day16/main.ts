import * as clonedeep from 'lodash.clonedeep';
import * as uniq from 'lodash.uniq';
import * as Logger from 'bunyan';

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

export const findMatchingOpcodes = (before: Registers, instruction: number[], after: Registers): OpCode[] => {
    return opCodes.filter(opCode => {
        let register = clonedeep(before);
        register = opCode(instruction[1], instruction[2], instruction[3], register);
        return matches(register, after);
    });
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
            if (findMatchingOpcodes(before, instruction, after).length >= 3) {
                count++;
            }
            before = null;
            after = null;
            instruction = null;
        }
    });
    return count;
};

export const findOpCodeWithOnePossibleMatch = (possibleOpCodeMatches) => {
    for (const id in possibleOpCodeMatches) {
        if (!possibleOpCodeMatches.hasOwnProperty(id)) {
            continue;
        }
        const matches = uniq(possibleOpCodeMatches[id]);
        if (matches.length === 1) {
            return id;
        }
    }
    return false;
};

export const run2 = (input: string[], _log: Logger): number => {
    let before;
    let after;
    let instruction;
    const possibleOpCodeMatches = {};
    const program = [];
    let parseProgram = false;
    input.forEach(line => {
        if (line.startsWith('Before')) {
            before = parseRegister(line.replace('Before: ', ''));
        } else if (line.startsWith('After')) {
            after = parseRegister(line.replace('After: ', ''));
        } else if (line.trim() === '++++++++') {
            parseProgram = true;
            _log.info('Found blank line');
        } else {
            instruction = parseInstruction(line);
        }

        if (before && instruction && after) {
            if (!possibleOpCodeMatches[instruction[0]]) {
                possibleOpCodeMatches[instruction[0]] = [];
            }
            const matches = findMatchingOpcodes(before, instruction, after);
            possibleOpCodeMatches[instruction[0]].push(...matches);
            before = null;
            after = null;
            instruction = null;
        } else if (parseProgram && instruction) {
            program.push(instruction);
        }
    });
    const opCodes: { [key: number]: OpCode } = {};
    while (true) {
        const foundCode = findOpCodeWithOnePossibleMatch(possibleOpCodeMatches);
        if (foundCode === false) {
            break;
        }
        opCodes[foundCode] = possibleOpCodeMatches[foundCode][0];
        delete possibleOpCodeMatches[foundCode];
        _log.info({ id: foundCode }, 'Found match');
        for (const id in possibleOpCodeMatches) {
            if (!possibleOpCodeMatches.hasOwnProperty(id)) {
                continue;
            }
            possibleOpCodeMatches[id] = possibleOpCodeMatches[id].filter(possibleMatch => {
                return possibleMatch !== opCodes[foundCode];
            });
        }
    }
    _log.info({ opCodes }, 'Matched all op codes');
    let registers: Registers = {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    };
    program.forEach(instruction => {
        _log.info({ instruction }, 'Executing program instruction');
        registers = opCodes[instruction[0]](instruction[1], instruction[2], instruction[3], registers);
    });
    return registers[0];
};
