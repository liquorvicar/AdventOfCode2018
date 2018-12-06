import test from 'ava';
import {
    EventType,
    findFavouriteMinute, findGuardMostAsleepOnSingleMinute,
    findGuardWithMostMinutes,
    LogEvent,
    parseLine,
    processEvents, sortEvents
} from '../../src/day4/main';
import { createLogger } from 'bunyan';

const log = createLogger({ name: 'AoC2018-4-tests', level: 'debug' });

test('Parses guard beginning shift event', t => {
    const log = '[1518-11-01 00:00] Guard #10 begins shift';
    const expected = {
        day: '11-01',
        time: 0,
        guard: 10,
        event: <EventType>'start-shift'
    };
    t.deepEqual(parseLine(log), expected);
});

test('Parses falling asleep event', t => {
    const log = '[1518-11-01 00:05] falls asleep';
    const expected = {
        day: '11-01',
        time: 5,
        guard: undefined,
        event: <EventType>'falls-asleep'
    };
    t.deepEqual(parseLine(log), expected);
});

test('Parses waking up event', t => {
    const log = '[1518-11-01 00:25] wakes up';
    const expected = {
        day: '11-01',
        time: 25,
        guard: undefined,
        event: <EventType>'wakes-up'
    };
    t.deepEqual(parseLine(log), expected);
});

test('Parses guard beginning shift event before midnight', t => {
    const log = '[1518-11-01 23:58] Guard #99 begins shift';
    const expected = {
        day: '11-02',
        time: 0,
        guard: 99,
        event: <EventType>'start-shift'
    };
    t.deepEqual(parseLine(log), expected);
});

test('Calculate when each guard is asleep', t => {
    const events = [
        '[1518-11-01 00:00] Guard #10 begins shift',
        '[1518-11-01 00:05] falls asleep',
        '[1518-11-01 00:25] wakes up',
        '[1518-11-02 00:40] falls asleep',
        '[1518-11-01 00:30] falls asleep',
        '[1518-11-01 00:55] wakes up',
        '[1518-11-03 00:05] Guard #10 begins shift',
        '[1518-11-02 00:50] wakes up',
        '[1518-11-03 00:24] falls asleep',
        '[1518-11-04 00:36] falls asleep',
        '[1518-11-03 00:29] wakes up',
        '[1518-11-01 23:58] Guard #99 begins shift',
        '[1518-11-04 00:02] Guard #99 begins shift',
        '[1518-11-04 00:46] wakes up',
        '[1518-11-05 00:45] falls asleep',
        '[1518-11-05 00:03] Guard #99 begins shift',
        '[1518-11-05 00:55] wakes up'
    ].map(parseLine);
    const diary = processEvents(events);
    t.is(diary.length, 5);
    t.is(diary[0].guard, 10);
    t.is(diary[1].guard, 99);
    t.false(diary[2].minutes[23]);
    t.true(diary[2].minutes[24]);
    t.true(diary[2].minutes[28]);
    t.false(diary[2].minutes[29]);
    t.is(diary[3].day, '11-04');
});

test('Find guard with most minutes asleep', t => {
    const events = [
        '[1518-11-01 00:00] Guard #10 begins shift',
        '[1518-11-01 00:05] falls asleep',
        '[1518-11-01 00:25] wakes up',
        '[1518-11-01 00:30] falls asleep',
        '[1518-11-01 00:55] wakes up',
        '[1518-11-01 23:58] Guard #99 begins shift',
        '[1518-11-02 00:10] falls asleep',
        '[1518-11-02 00:20] wakes up',
        '[1518-11-02 00:40] falls asleep',
        '[1518-11-02 00:50] wakes up',
        '[1518-11-03 00:05] Guard #10 begins shift',
        '[1518-11-03 00:29] wakes up',
        '[1518-11-03 00:24] falls asleep',
        '[1518-11-04 00:02] Guard #99 begins shift',
        '[1518-11-04 00:26] falls asleep',
        '[1518-11-04 00:36] wakes up',
        '[1518-11-04 00:36] falls asleep',
        '[1518-11-04 00:46] wakes up',
        '[1518-11-05 00:03] Guard #99 begins shift',
        '[1518-11-05 00:15] falls asleep',
        '[1518-11-05 00:25] wakes up',
        '[1518-11-05 00:45] falls asleep',
        '[1518-11-05 00:55] wakes up'
    ].map(parseLine);
    const diary = processEvents(events);
    const guard = findGuardWithMostMinutes(diary, log);
    t.is(guard, 99);
});

test('Find most common minute for guard', t => {
    const events = [
        '[1518-11-01 00:00] Guard #10 begins shift',
        '[1518-11-01 00:05] falls asleep',
        '[1518-11-01 00:25] wakes up',
        '[1518-11-02 00:40] falls asleep',
        '[1518-11-01 00:30] falls asleep',
        '[1518-11-01 00:55] wakes up',
        '[1518-11-03 00:05] Guard #10 begins shift',
        '[1518-11-02 00:50] wakes up',
        '[1518-11-03 00:24] falls asleep',
        '[1518-11-04 00:36] falls asleep',
        '[1518-11-03 00:29] wakes up',
        '[1518-11-01 23:58] Guard #99 begins shift',
        '[1518-11-04 00:02] Guard #99 begins shift',
        '[1518-11-04 00:46] wakes up',
        '[1518-11-05 00:45] falls asleep',
        '[1518-11-05 00:03] Guard #99 begins shift',
        '[1518-11-05 00:55] wakes up'
    ].map(parseLine);
    const diary = processEvents(events);
    const favouriteMinute = findFavouriteMinute(diary, 10);
    t.is(favouriteMinute.favourite, 24);
});

test('Sort events', t => {
    const events: LogEvent[] = [
        {
            day: '01-03',
            time: 37,
            guard: 3,
            event: 'start-shift'
        },
        {
            day: '01-01',
            time: 59,
            guard: 2,
            event: 'start-shift'
        },
        {
            day: '10-11',
            time: 43,
            guard: 5,
            event: 'start-shift'
        },
        {
            day: '02-29',
            time: 12,
            guard: 4,
            event: 'start-shift'
        },
        {
            day: '01-01',
            time: 1,
            guard: 1,
            event: 'start-shift'
        }
    ];
    const sortedEvents = sortEvents(events);
    t.is(1, sortedEvents[0].guard);
    t.is(2, sortedEvents[1].guard);
    t.is(3, sortedEvents[2].guard);
    t.is(4, sortedEvents[3].guard);
    t.is(5, sortedEvents[4].guard);
});

test('Find guard with most asleep on single minute', t => {
    const events = [
        '[1518-11-01 00:00] Guard #10 begins shift',
        '[1518-11-01 00:05] falls asleep',
        '[1518-11-01 00:25] wakes up',
        '[1518-11-02 00:40] falls asleep',
        '[1518-11-01 00:30] falls asleep',
        '[1518-11-01 00:55] wakes up',
        '[1518-11-03 00:05] Guard #10 begins shift',
        '[1518-11-02 00:50] wakes up',
        '[1518-11-03 00:24] falls asleep',
        '[1518-11-04 00:36] falls asleep',
        '[1518-11-03 00:29] wakes up',
        '[1518-11-01 23:58] Guard #99 begins shift',
        '[1518-11-04 00:02] Guard #99 begins shift',
        '[1518-11-04 00:46] wakes up',
        '[1518-11-05 00:45] falls asleep',
        '[1518-11-05 00:03] Guard #99 begins shift',
        '[1518-11-05 00:55] wakes up'
    ].map(parseLine);
    const diary = processEvents(events);
    const mostAsleep = findGuardMostAsleepOnSingleMinute(diary);
    t.is(mostAsleep.guard, 99);
    t.is(mostAsleep.minute, 45);
});
