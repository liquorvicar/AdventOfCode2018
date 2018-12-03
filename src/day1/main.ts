import * as intersection from 'lodash.intersection';

function runChanges(changes: number[], frequency: number): number[] {
    const frequencies: number[] = [];
    for (const change of changes) {
        frequency += change;
        frequencies.push(frequency);
    }
    return frequencies;
}


export const parse = (rawInputs, _log) => {
    return rawInputs.map((change): number => parseInt(change, 10));
};

export const run1 = (changes, _log) => {
    const frequency = 0;
    const frequencies = runChanges(changes, frequency);
    return frequencies.pop();
};

export const run2 = (changes, log) => {
    let frequency = 0;
    let frequencies: number[] = [];
    let found = false;
    let duplicate = 0;

    while (!found) {
        const newFrequencies = runChanges(changes, frequency);
        const duplicates = intersection(newFrequencies, frequencies);
        if (duplicates.length > 0) {
            log.debug({ frequencies, duplicates });
            duplicate = duplicates[0];
            found = true;
        } else {
            frequencies = frequencies.concat(newFrequencies);
            frequency = newFrequencies.pop();
        }
    }
    return duplicate;
};
