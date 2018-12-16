import { test } from 'ava';
import { countRecipesBeforeSequence, createRecipes, nextTenRecipes } from '../../src/day14/main';
import * as Logger from 'bunyan';

const logger = Logger.createLogger({ name: 'day-12-tests' });

const recipeSequence = [
    {
        recipes: [3, 7],
        elves: [0, 1]
    },
    {
        recipes: [3, 7, 1, 0],
        elves: [0, 1]
    },
    {
        recipes: [3, 7, 1, 0, 1, 0],
        elves: [4, 3]
    },
    {
        recipes: [3, 7, 1, 0, 1, 0, 1],
        elves: [6, 4]
    },
    {
        recipes: [3, 7, 1, 0, 1, 0, 1, 2],
        elves: [0, 6]
    },
    {
        recipes: [3, 7, 1, 0, 1, 0, 1, 2, 4],
        elves: [4, 8]
    }
];

const testData = [
    [recipeSequence[0], recipeSequence[1]],
    [recipeSequence[1], recipeSequence[2]],
    [recipeSequence[2], recipeSequence[3]],
    [recipeSequence[3], recipeSequence[4]],
    [recipeSequence[4], recipeSequence[5]]
];

testData.forEach((recipes, index) => {
    test('Create new recipes ' + index.toString(), t => {
        t.deepEqual(createRecipes(recipes[0]), recipes[1]);
    });
});

const nextTenRecipeTests = [
    { iterations: 9, nextRecipes: '5158916779' },
    { iterations: 5, nextRecipes: '0124515891' },
    { iterations: 18, nextRecipes: '9251071085' },
    { iterations: 2018, nextRecipes: '5941429882' }
];

nextTenRecipeTests.forEach(data => {
    test('Next ten recipes after ' + data.iterations, t => {
        t.is(nextTenRecipes(data.iterations), data.nextRecipes);
    });
});

test('Find recipes before 51589 appears', t => {
    t.is(countRecipesBeforeSequence('51589', logger), 9);
});

test('Find recipes before 01245 appears', t => {
    t.is(countRecipesBeforeSequence('01245', logger), 5);
});

test('Find recipes before 92510 appears', t => {
    t.is(countRecipesBeforeSequence('92510', logger), 18);
});

test('Find recipes before 59414 appears', t => {
    t.is(countRecipesBeforeSequence('59414', logger), 2018);
});
