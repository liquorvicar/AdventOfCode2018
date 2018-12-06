import * as Logger from 'bunyan';

export const reacts = (first: string, second: string): boolean => {
    if (first.toLowerCase() !== second.toLowerCase()) {
        return false;
    }
    return first !== second;
};

export const processReaction = (polymer: string): string => {
    let stillReacting = true;
    let newPolymer = polymer;
    while (stillReacting) {
        stillReacting = false;
        let pointer = 0;
        while (pointer < (newPolymer.length - 1)) {
            if (reacts(newPolymer[pointer], newPolymer[pointer + 1])) {
                newPolymer = newPolymer.replace(newPolymer[pointer] + newPolymer[pointer + 1], '');
                stillReacting = true;
            } else {
                pointer++;
            }
        }
    }
    return newPolymer;
};

export const parse = (rawInput: string[]) => {
    return rawInput;
};

export const run1 = (input: string[], _log: Logger): number => {
    const newPolymer = processReaction(input[0]);
    return newPolymer.length;
};

export const findAllTypes = (polymer: string): string[] => {
    return polymer.split('').reduce((types, type) => {
        if (types.indexOf(type.toLowerCase()) < 0) {
            types.push(type.toLowerCase());
        }
        return types;
    }, []).sort();
};

export const findShortestPossiblePolymer = (polymer: string): number => {
    const types = findAllTypes(polymer);
    let shortestPolymer = polymer.length;
    types.forEach(type => {
        const removeType = polymer.replace(new RegExp(type, 'g'), '')
            .replace(new RegExp(type.toUpperCase(), 'g'), '');
        const reducedPolymer = processReaction(removeType);
        if (reducedPolymer.length < shortestPolymer) {
            shortestPolymer = reducedPolymer.length;
        }
    });
    return shortestPolymer;
};

export const run2 = (input: string[], _log: Logger): number => {
    return findShortestPossiblePolymer(input[0]);
};
