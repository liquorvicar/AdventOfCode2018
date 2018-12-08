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

const detectAllPossibleSteps = (tree: StepTree) => {
    const possibleSteps = [];
    for (const step in tree) {
        if (!tree.hasOwnProperty(step)) {
            continue;
        }
        if (tree[step].length === 0) {
            possibleSteps.push(step);
        }
    }
    return possibleSteps.sort();
};

export const detectNextStep = (tree: StepTree): string => {
    const possibleSteps = detectAllPossibleSteps(tree);
    if (possibleSteps.length === 0) {
        return '';
    }
    return possibleSteps[0];
};

const markTaskDone = (tree: StepTree, step): StepTree => {
    delete tree[step];
    for (const remainingStep in tree) {
        if (!tree.hasOwnProperty(remainingStep)) {
            continue;
        }
        tree[remainingStep] = tree[remainingStep].filter(element => element !== step);
    }
    return tree;
};

export const calculateStepOrder = (tree: StepTree): string => {
    let order = '';
    let step = detectNextStep(tree);
    while (step !== '') {
        order = order + step;
        tree = markTaskDone(tree, step);
        step = detectNextStep(tree);
    }
    return order;
};

export const run1 = (tree: StepTree, _log: Logger): string => {
    return calculateStepOrder(tree);
};

type Worker = {
    task: string;
    timeLeft: number;
}

export const allocateWorkers = (tree: StepTree, workers: Worker[], taskOverhead: number): Worker[] => {
    const tasksStarted = workers.map(worker => worker.task).filter(task => task);
    const possibleTasks = detectAllPossibleSteps(tree);
    workers = workers.map(worker => {
        if (worker.task !== '') {
            worker.timeLeft -= 1;
        }
        return worker;
    })
    .map(worker => {
        if (worker.task === '') {
            const step = possibleTasks.find(task => tasksStarted.indexOf(task) < 0);
            if (step) {
                worker.task = step;
                worker.timeLeft = step.charCodeAt(0) - 65 + taskOverhead;
                possibleTasks.shift();
                tasksStarted.push(step);
            }
        }
        return worker;
    });
    return workers;
};

export const processAllSteps = (tree: StepTree, workers: Worker[], taskOverhead: number, log: Logger): number => {
    let second = 0;
    let allTasksCompleted = false;
    do {
        const finishedTasks = [];
        workers = workers.map(worker => {
            if (worker.task !== '' && worker.timeLeft === 0) {
                finishedTasks.push(worker.task);
                worker.task = '';
            }
            return worker;
        });
        finishedTasks.forEach(task => {
            tree = markTaskDone(tree, task);
            log.info({ second, task, tree }, 'Task finished');
        });
        workers = allocateWorkers(tree, workers, taskOverhead);
        allTasksCompleted = true;
        for (const remainingStep in tree) {
            if (!tree.hasOwnProperty(remainingStep)) {
                continue;
            }
            allTasksCompleted = false;
            break;
        }
        second++;
    } while (!allTasksCompleted);
    return second - 1;
};

export const run2 = (tree: StepTree, log: Logger): number => {
    const workers = [
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 },
        { task: '', timeLeft: 0 }
    ];
    return processAllSteps(tree, workers, 60, log);
};
