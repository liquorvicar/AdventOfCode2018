import * as Logger from 'bunyan';

export const runModel = (initialState: string, rules: { pattern: string, nextGeneration: string }[], generation: number, log: Logger): { pos: number, pot: string }[] => {
    let currentGeneration = 0;
    let pots = initialState.split('').map((pot, pos) => {
        return { pos, pot };
    }).filter(pot => pot.pot === '#');
    let previousSum = 0;
    while (currentGeneration < generation) {
        const firstPot = pots[0].pos;
        const lastPot = pots[pots.length - 1].pos;
        const newPots = [];
        for (let pot = firstPot - 4; pot <= lastPot + 4; pot++) {
            let potSequence = '';
            for (let sequence = pot - 2; sequence <= pot + 2; sequence++) {
                if (pots.find(thisPot => thisPot.pos === sequence)) {
                    potSequence = potSequence + '#';
                } else {
                    potSequence = potSequence + '.';
                }
            }
            const matchedRule = rules.find(rule => rule.pattern === potSequence);
            if (matchedRule && matchedRule.nextGeneration === '#') {
                newPots.push({
                    pos: pot,
                    pot: '#'
                });
            }
        }
        pots = newPots;
        currentGeneration++;
        const sum = pots.reduce((sum, pot) => {
            return sum + pot.pos
        }, 0);
        log.info({ sum, previousSum, diff: (sum - previousSum), currentGeneration }, 'Generation');
        previousSum = sum;
        if (currentGeneration % 10000 === 0) {
            log.info({ currentGeneration }, 'Generation done');
        }
    }
    return pots;
};

export const sumPotsWithPlants = (initialState: string, rules: ({ nextGeneration: string; pattern: string })[], generation: number, log: Logger): number => {
    const endPots = runModel(initialState, rules, generation, log);
    return endPots.reduce((sum, pot) => {
        return sum + pot.pos
    }, 0);
};

export const run1 = (rules: ({ nextGeneration: string; pattern: string })[], log: Logger): number => {
    const initialState = '####....#...######.###.#...##....#.###.#.###.......###.##..##........##..#.#.#..##.##...####.#..##.#';
    return sumPotsWithPlants(initialState, rules, 20, log);
};

export const parse = (rawInput: string[], _log: Logger): ({ nextGeneration: string; pattern: string })[] => {
    return rawInput.map(input => {
        const ruleParts = input.split(' => ');
        return {
            pattern: ruleParts[0],
            nextGeneration: ruleParts[1]
        };
    });
};

export const run2 = (rules: ({ nextGeneration: string; pattern: string })[], log: Logger): number => {
    const initialState = '####....#...######.###.#...##....#.###.#.###.......###.##..##........##..#.#.#..##.##...####.#..##.#';
    return sumPotsWithPlants(initialState, rules, 50000000000, log);
};
