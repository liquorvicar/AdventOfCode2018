import * as Logger from 'bunyan';

export type StepTree = {
    [K: string]: string[];
}

export const parse = (rawInputs: string[], _log: Logger): StepTree => {
    const tree = {};
    rawInputs.forEach(input => {
        const matches = input.match('Step ([A-Z]{1}) must be finished before step ([A-Z]{1}) can begin.');
        if (tree[matches[1]] === undefined) {
            tree[matches[1]] = [];
        }
        if (tree[matches[2]] === undefined) {
            tree[matches[2]] = [];
        }
        tree[matches[2]].push(matches[1]);
    });
    return tree;
};

export const detectNextStep = (tree: StepTree): string => {
    const possibleSteps = [];
    for (const step in tree) {
        if (!tree.hasOwnProperty(step)) {
            continue;
        }
        if (tree[step].length === 0) {
            possibleSteps.push(step);
        }
    }
    if (possibleSteps.length === 0) {
        return '';
    }
    return possibleSteps.sort()[0];
};

export const calculateStepOrder = (tree: StepTree): string => {
    let order = '';
    let step = detectNextStep(tree);
    while (step !== '') {
        order = order + step;
        delete tree[step];
        for (const remainingStep in tree) {
            if (!tree.hasOwnProperty(remainingStep)) {
                continue;
            }
            tree[remainingStep] = tree[remainingStep].filter(element => element !== step);
        }
        step = detectNextStep(tree);
    }
    return order;
};

export const run1 = (tree: StepTree, _log: Logger): string => {
    return calculateStepOrder(tree);
};
