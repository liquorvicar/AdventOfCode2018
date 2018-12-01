import {readFileSync} from "fs";
import {createLogger} from "bunyan";

const inputs = readFileSync('./src/day1/input.txt', { encoding: 'ascii' });
const log = createLogger({ name: 'AoC2018-1', level: 'debug' });

let frequency = 0;
const changes: number[] = inputs.split("\n")
    .filter(value => value !== "")
    .map((change): number => parseInt(change, 10));
for (const change of changes) {
    frequency+= change;
}

log.debug({ start: frequency }, 'Answer');
