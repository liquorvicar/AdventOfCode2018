import * as Logger from 'bunyan';

export const runModel = (initialState: string, rules: { pattern: string, nextGeneration: string }[], generation: number, log: Logger): { state: string, start: number } => {
    let currentGenerationPots = initialState.split('');
    let currentGeneration = 0;
    let start = 0;
    const firstPlant = currentGenerationPots.indexOf('#');
    for (let i = firstPlant; i < 2; i++) {
        currentGenerationPots.unshift('.');
        start--;
    }
    let lastPlant = currentGenerationPots.lastIndexOf('#');
    while (lastPlant > (currentGenerationPots.length - 3)) {
        currentGenerationPots.push('.');
        lastPlant = currentGenerationPots.lastIndexOf('#');
    }
    while (currentGeneration < generation) {
        const newGenerationPots = currentGenerationPots.map((_pot, index) => {
            let potSequence: string;
            if (index < 2) {
                potSequence = currentGenerationPots.slice(0, index + 3).join('');
                for (let i = potSequence.length; i < 5; i++) {
                    potSequence = '.' + potSequence;
                }
            } else {
                potSequence = currentGenerationPots.slice(index - 2, index + 3).join('');
                for (let i = potSequence.length; i < 5; i++) {
                    potSequence = potSequence + '.';
                }
            }
            const matchedRule = rules.find(rule => {
                return rule.pattern === potSequence;
            });
            if (!matchedRule) {
                log.info({ potSequence, index, generation }, 'Unmatched rule');
            }
            return matchedRule ? matchedRule.nextGeneration : '.';
        });
        currentGeneration++;
        currentGenerationPots = newGenerationPots;
        const firstPlant = currentGenerationPots.indexOf('#');
        for (let i = firstPlant; i < 2; i++) {
            currentGenerationPots.unshift('.');
            start--;
        }
        let lastPlant = currentGenerationPots.lastIndexOf('#');
        while (lastPlant > (currentGenerationPots.length - 3)) {
            currentGenerationPots.push('.');
            lastPlant = currentGenerationPots.lastIndexOf('#');
        }
        log.info({ currentGeneration, pots: currentGenerationPots.join('') }, 'Generation done');
    }
    return { state: currentGenerationPots.join(''), start: start };
};

export const sumPotsWithPlants = (initialState: string, rules: ({ nextGeneration: string; pattern: string })[], generation: number, log: Logger): number => {
    const endState = runModel(initialState, rules, generation, log);
    const endPots = endState.state.split('');
    return endPots.reduce((sum, pot, index) => {
        return pot === '#' ? (sum + index + endState.start) : sum;
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
