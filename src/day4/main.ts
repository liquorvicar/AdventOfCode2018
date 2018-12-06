import * as moment from 'moment';
import * as Logger from 'bunyan';

export type EventType = 'start-shift' | 'falls-asleep' | 'wakes-up';

export type LogEvent = {
    day: string;
    time: number;
    guard?: number;
    event: EventType
};

export const parseLine = (rawInput: string): LogEvent => {
    const parts = rawInput.match('([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}):([0-9]{2})\] (.*)');
    let eventType: EventType;
    let guard: number;
    let date = moment(parts[1]);
    let minutes = parseInt(parts[3], 10);
    switch (parts[4]) {
        case 'falls asleep':
            eventType = 'falls-asleep';
            break;
        case 'wakes up':
            eventType = 'wakes-up';
            break;
        default:
            eventType = 'start-shift';
            const guardInfo = parts[4].match('#([0-9]+)');
            guard = parseInt(guardInfo[1], 10);
            const hour = parseInt(parts[2], 10);
            if (hour === 23) {
                date = date.add(1, 'day');
                minutes = 0;
            }
            break;
    }
    return {
        day: date.format('MM-DD'),
        time: minutes,
        event: eventType,
        guard: guard
    };
};

export const parse = (rawInput: string[]) => {
    return rawInput.map(parseLine);
};

type DiaryEntry = {
    day: string;
    guard: number;
    minutes: {
        [K: number]: boolean;
    }
};
type Diary = DiaryEntry[];

export const sortEvents = (events: LogEvent[]): LogEvent[] => {
    return events.sort((a, b) => {
        return (a.day < b.day || (a.day === b.day && a.time < b.time)) ? -1 : 1;
    });
};

export const processEvents = (events: LogEvent[]): Diary => {
    const sortedEvents = sortEvents(events);
    let currentEntry: DiaryEntry;
    const diary: Diary = [];
    let asleepSince = -1;
    sortedEvents.forEach(event => {
        if (event.event === 'start-shift') {
            if (currentEntry) {
                diary.push(currentEntry);
            }
            currentEntry = {
                day: event.day,
                guard: event.guard,
                minutes: {}
            };
            for (let minute = 0; minute < 60; minute++ ) {
                currentEntry.minutes[minute] = false;
            }
            asleepSince = -1;
        } else if (event.event === 'falls-asleep') {
            asleepSince = event.time;
        } else {
            for (let asleep = asleepSince; asleep < event.time; asleep++) {
                currentEntry.minutes[asleep] = true;
            }
            asleepSince = -1;
        }
    });
    if (currentEntry) {
        diary.push(currentEntry);
    }
    return diary;
};

export const findGuardWithMostMinutes = (diary: Diary, log: Logger): number => {
    const guards: { [K: number]: number } = {};
    diary.forEach(entry => {
        let minsForEntry = 0;
        for (const minute in entry.minutes) {
            if (entry.minutes[minute]) {
                minsForEntry++;
            }
        }
        if (guards[entry.guard] === undefined) {
            guards[entry.guard] = 0;
        }
        guards[entry.guard] += minsForEntry;
    });
    log.info({ guards }, 'How sleepy are these peeps');
    let id = 0;
    let maxMins = 0;
    for (const guard of Object.keys(guards)) {
        if (!guards.hasOwnProperty(guard)) {
            continue;
        }
        if (guards[guard] > maxMins) {
            id = parseInt(guard, 10);
            maxMins = guards[guard];
            log.info({ id, maxMins }, 'New sleepiest guard');
        }
    }
    return id;
};

export const findFavouriteMinute = (diary: Diary, guard: number): number => {
    const entriesForGuard = diary.filter(entry => entry.guard === guard);
    const minutes: { [K: number]: number } = {};
    for (let minute = 0; minute < 60; minute++) {
        minutes[minute] = 0;
    }
    entriesForGuard.forEach(entry => {
        for (let minute = 0; minute < 60; minute++) {
            if (entry.minutes[minute]) {
                minutes[minute]++;
            }
        }
    });
    let maxMins = 0;
    let favourite = 0;
    for (let minute = 0; minute < 60; minute++) {
        if (minutes[minute] > maxMins) {
            maxMins = minutes[minute];
            favourite = minute;
        }
    }
    return favourite;
};

export const run1 = (events: LogEvent[], log: Logger) => {
    const diary = processEvents(events);
    const guard = findGuardWithMostMinutes(diary, log);
    log.info({ guard }, 'Sleepiest guard found');
    const favouriteMinute = findFavouriteMinute(diary, guard);
    log.info({ favouriteMinute }, 'Fave!');
    return guard * favouriteMinute;
};
