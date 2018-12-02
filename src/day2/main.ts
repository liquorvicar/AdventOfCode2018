function getLetterCounts(string) {
    const letters: { [K: string]: number } = {};
    for (const letter of string) {
        if (letters[letter] !== undefined) {
            letters[letter] += 1;
        } else {
            letters[letter] = 1;
        }
    }
    return letters;
}

const hasLetterXTimes = (letters, times) => {
    for (const letter in letters) {
        if (letters[letter] === times) {
            return true;
        }
    }
    return false;
};

export const hasLetterTwice = (string) => {
    return hasLetterXTimes(getLetterCounts(string), 2);
};

export const hasLetterThreeTimes = (string) => {
    return hasLetterXTimes(getLetterCounts(string), 3);
};

export const countRepeatedLetters = (strings) => {
    const counts: { [K: number]: number } = {
        2: 0,
        3: 0
    };
    strings.forEach(string => {
        const letterCounts = getLetterCounts(string);
        if (hasLetterXTimes(letterCounts, 2)) {
            counts[2]++;
        }
        if (hasLetterXTimes(letterCounts, 3)) {
            counts[3]++;
        }
    });
    return counts;
};

export const parse = (rawInputs, _log) => {
    return rawInputs.split("\n")
        .filter(value => value !== "");
};

export const run1 = (strings, _log) => {
    const counts = countRepeatedLetters(strings);
    return counts[2] * counts[3];
};
