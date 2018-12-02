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

export const differByOne = (first, second) => {
    let diffs = 0;
    for (let pos = 0; pos < first.length; pos++) {
        if (second[pos] !== first[pos]) {
            diffs++;
        }
    }
    return diffs === 1;
};

export const findStringsDifferingByOne = (strings) => {
    const differingStrings = [];
    while (strings.length > 1 && differingStrings.length === 0) {
        const string = strings.shift();
        strings.forEach(stringToCompare => {
            if (differByOne(string, stringToCompare)) {
                differingStrings.push(string);
                differingStrings.push(stringToCompare);
            }
        });
    }
    return differingStrings;
};

export const findMatchingChars = (first, second) => {
    let matchingChars = '';
    for (let pos = 0; pos < first.length; pos++) {
        if (second[pos] === first[pos]) {
            matchingChars = matchingChars + first[pos];
        }
    }
    return matchingChars;
};

export const run2 = (strings, _log) => {
    const differingStrings = findStringsDifferingByOne(strings);
    return findMatchingChars(differingStrings[0], differingStrings[1]);
};
