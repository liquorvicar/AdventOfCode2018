import * as Logger from 'bunyan';

export const createRecipes = (recipes: { recipes: number[]; elves: number[] }) => {
    const newRecipe = recipes.recipes[recipes.elves[0]] + recipes.recipes[recipes.elves[1]];
    if (newRecipe >= 10) {
        recipes.recipes.push(1);
    }
    recipes.recipes.push(newRecipe % 10);
    for (let elf = 0; elf <= 1; elf++) {
        const currentPosition = recipes.elves[elf];
        const stepsForward = recipes.recipes[currentPosition] + 1;
        recipes.elves[elf] = (currentPosition + stepsForward) % recipes.recipes.length;
    }
    return recipes;
};

export const nextTenRecipes = (iterations: number): string => {
    let kitchen = {
        recipes: [3, 7],
        elves: [0, 1]
    };
    while (kitchen.recipes.length < (iterations + 10)) {
        kitchen = createRecipes(kitchen);
    }
    return kitchen.recipes.slice(iterations, (iterations + 10)).join('');
};

export const parse = (rawInput: string[], _log: Logger): number => {
    return parseInt(rawInput[0], 10);
};

export const run1 = (iterations: number, _log: Logger): string => {
    return nextTenRecipes(iterations);
};
