import {readFileSync} from "fs";
import {createLogger} from "bunyan";

const inputs = readFileSync('./src/day1/input.txt', { encoding: 'ascii' });
const log = createLogger({ name: 'AoC2018-1', level: 'debug' });

let start = 0;
const values = inputs.split("\n").filter(value => value !== "");
for (const value in values) {
    const change = parseInt(values[value], 10);
    log.debug(change);
    start+= change;
}

log.debug({ start }, 'Answer');
