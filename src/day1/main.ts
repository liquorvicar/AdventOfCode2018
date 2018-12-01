import {readFileSync} from "fs";
import {createLogger} from "bunyan";
import * as intersection from "lodash.intersection";

function runChanges(changes: number[], frequency: number): number[] {
    const frequencies: number[] = [];
    for (const change of changes) {
        frequency += change;
        frequencies.push(frequency);
    }
    return frequencies;
}


const inputs = readFileSync('./src/day1/input.txt', { encoding: 'ascii' });
const log = createLogger({ name: 'AoC2018-1', level: 'debug' });


let frequency = 0;
const changes: number[] = inputs.split("\n")
    .filter(value => value !== "")
    .map((change): number => parseInt(change, 10));
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

log.debug({ duplicate }, 'Answer');
