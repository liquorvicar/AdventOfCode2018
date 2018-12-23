import * as Logger from 'bunyan';
import * as clonedeep from 'lodash.clonedeep';

export type UnitType = 'Goblin' | 'Elf';
export type Unit = { type: UnitType; x: number; y: number; hitPoints: number; };
export type Location = { x: number; y: number; };
export type State = {
    cavern: Location[];
    units: Unit[];
};

export const parse = (rawInput: string[], _log: Logger): State => {
    return rawInput.reduce((state, row, rowNumber) => {
        return row.split('').reduce((state, location, columnNumber) => {
            if (location === '#') {
                return state;
            }
            state.cavern.push({ x: columnNumber, y: rowNumber });
            if (location === 'G' || location === 'E') {
                state.units.push({
                    type: location === 'G' ? 'Goblin' : 'Elf',
                    x: columnNumber,
                    y: rowNumber,
                    hitPoints: 200
                });
            }
            return state;
        }, state);
    }, { cavern: [], units: [] });
};

export const getUnitsInTurnOrder = (units: Unit[]): Unit[] => {
    return units.sort((a, b) => {
        if (a.y < b.y) {
            return -1;
        } else if (a.y > b.y) {
            return 1;
        }
        return a.x <= b.x ? -1 : 1;
    });
};

export const identifyTargets = (unitType: UnitType, units: Unit[]): Unit[] => {
    return units.filter(unit => unit.type !== unitType && unit.hitPoints > 0);
};

export const findTargetsInRange = (unit: Unit, units: Unit[]): Unit[] => {
    return units.filter(possibleTarget => {
        if (possibleTarget.type === unit.type) {
            return false;
        }
        if (unit.x === possibleTarget.x && Math.abs(unit.y - possibleTarget.y) === 1) {
            return true;
        }
        if (unit.y === possibleTarget.y && Math.abs(unit.x - possibleTarget.x) === 1) {
            return true;
        }
        return false;
    })
};

export const findOpenLocations = (targets: Location[], state: State): Location[] => {
    const openLocations = targets.reduce((possibles: Location[], target) => {
        const possiblesForThisTarget = [
            { x: target.x - 1, y: target.y },
            { x: target.x + 1, y: target.y },
            { x: target.x, y: target.y - 1 },
            { x: target.x, y: target.y + 1 }
        ];
        possiblesForThisTarget.forEach(possible => {
            if (possibles.find(selectedPossible => selectedPossible.x === possible.x && selectedPossible.y === possible.y) === undefined) {
                possibles.push(possible);
            }
        });
        return possibles;
    }, [])
        .filter(possible => {
            return state.cavern.find(location => location.x === possible.x && location.y === possible.y)
                && (state.units.find(unit => unit.x === possible.x && unit.y === possible.y) === undefined);
        })
        .sort((a, b) => {
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            }
            return a.x <= b.x ? -1 : 1;
        });
    return openLocations;
};

const sortByManhattanDistance = (locations: Location[], target: Location): Location[] => {
    return locations.sort((a, b) => {
        const distanceToA = Math.abs(target.x - a.x) + Math.abs(target.y - a.y);
        const distanceToB = Math.abs(target.x - b.x) + Math.abs(target.y - b.y);
        return distanceToA - distanceToB;
    });
};

const findShortestRoutes = (unit: Unit, targets: Location[], state: State): Location[][] => {
    const current: Location = { x: unit.x, y: unit.y };
    const stepsToTry: Location[] = [];
    const visitedNodes = new Set();
    const paths: { [key: string]: Location[] } = {};
    paths[`${current.x}:${current.y}`] = [];
    stepsToTry.push(current);
    const foundPaths: Location[][] = [];

    while (stepsToTry.length > 0) {
        const thisStep = stepsToTry.shift();
        const thisPath = paths[`${thisStep.x}:${thisStep.y}`];
        if (foundPaths.length > 0 && thisPath.length > foundPaths[0].length) {
            break;
        }
        if (targets.find(target => target.x === thisStep.x && target.y === thisStep.y)) {
            foundPaths.push(thisPath);
            break;
        }
        if (thisPath.length > 50) {
            break;
        }
        const nextSteps = findOpenLocations([thisStep], state);
        nextSteps.forEach(nextStep => {
            if (visitedNodes.has(nextStep)) {
                return;
            }
            if (!stepsToTry.find(stepToTry => stepToTry.x === nextStep.x && stepToTry.y === nextStep.y)) {
                const nextPath = thisPath.slice();
                nextPath.push(nextStep);
                paths[`${nextStep.x}:${nextStep.y}`] = nextPath;
                stepsToTry.push(nextStep);
            }
        });
        visitedNodes.add(thisStep);
    }
    return foundPaths;
};

export const findChosenTarget = (unit: Unit, inRange: Location[], state: State): Location[] => {
    const nearest: Location[][] = findShortestRoutes(unit, inRange, state);
    return nearest.reduce((chosen: Location[], route: Location[]) => {
        if (chosen === undefined) {
            return route;
        }
        const location = route[route.length - 1];
        const target = chosen[chosen.length - 1];
        if (location.y < target.y || (location.y === target.y && location.x < target.x)) {
            return route;
        }
        return chosen;
    }, undefined);
};

const moveUnit = (unit: Unit, state: State, targets: Location[]) => {
    const locations = findOpenLocations(targets, state);
    const sortedLocations = sortByManhattanDistance(locations, unit);
    if (sortedLocations.length === 0) {
        return state.units;
    }
    const chosen = findChosenTarget(unit, sortedLocations, state);
    if (!chosen) {
        return state.units;
    }
    const newLocation = chosen.shift();
    let newUnits = state.units;
    newUnits = newUnits.map(otherUnit => {
        if (otherUnit.x !== unit.x || otherUnit.y !== unit.y) {
            return otherUnit;
        }
        otherUnit.x = newLocation.x;
        otherUnit.y = newLocation.y;
        return otherUnit;
    });
    return newUnits;
};

export const takeTurn = (unit: Unit, state: State, elfAttackPoints: number): { units: Unit[], foundTarget: boolean } => {
    if (unit.hitPoints <= 0) {
        return { units: state.units, foundTarget: true };
    }
    let foundTarget = true;
    let units = state.units.slice();
    const targets = identifyTargets(unit.type, state.units);
    if (targets.length === 0) {
        foundTarget = false;
    }
    const targetsInRange = findTargetsInRange(unit, targets);
    if (targetsInRange.length === 0) {
        units = moveUnit(unit, state, targets);
    }
    units = attack(unit, units, elfAttackPoints);
    return { units, foundTarget };
};

export const takeAllTurns = (state: State, elfAttackPoints: number): { state: State, foundTarget: boolean } => {
    const units = getUnitsInTurnOrder(state.units);
    let foundTarget = true;
    units.forEach(unit => {
        const turnResult = takeTurn(unit, state, elfAttackPoints);
        state.units = turnResult.units;
        foundTarget = foundTarget && turnResult.foundTarget;
    });
    state.units = getUnitsInTurnOrder(state.units.filter(unit => unit.hitPoints > 0));
    return { state, foundTarget };
};

export const attack = (unit: Unit, units: Unit[], elfAttackPoints: number): Unit[] => {
    const targets = identifyTargets(unit.type, units);
    const targetsInRange = findTargetsInRange(unit, targets);
    if (targetsInRange.length === 0) {
        return units;
    }
    const target = targetsInRange.reduce((currentTarget, possibleTarget) => {
        if (!currentTarget) {
            return possibleTarget;
        }
        if (possibleTarget.hitPoints < currentTarget.hitPoints) {
            return possibleTarget;
        } else if (currentTarget.hitPoints < possibleTarget.hitPoints) {
            return currentTarget;
        }
        if (possibleTarget.y < currentTarget.y || (possibleTarget.y === currentTarget.y && possibleTarget.x < currentTarget.x)) {
            return possibleTarget;
        }
        return currentTarget;
    }, null);
    const attackPoints = unit.type === 'Elf' ? elfAttackPoints : 3;
    target.hitPoints = target.hitPoints - attackPoints;
    const newUnits = units.map(otherUnit => {
        if (otherUnit.x !== target.x || otherUnit.y !== target.y) {
            return otherUnit;
        }
        return target;
    });
    return newUnits;
};

export const runCombat = (state: State, elfAttackPoints: number, log: Logger): { turns: number, remainingUnits: Unit[] } => {
    const result = {
        turns: 0,
        remainingUnits: []
    };
    let combatInProgress = true;
    while (combatInProgress) {
        result.turns++;
        log.info(result.turns);
        const endOfTurn = takeAllTurns(state, elfAttackPoints);
        state = endOfTurn.state;
        combatInProgress = endOfTurn.foundTarget;
    }
    result.turns--;
    result.remainingUnits = state.units;
    return result;
};

export const run1 = (state: State, log: Logger): number => {
    const result = runCombat(state, 3, log);
    return result.turns * result.remainingUnits.reduce((sum, unit) => {
        return sum + unit.hitPoints;
    }, 0);
};

export const run2 = (state: State, log: Logger): number => {
    const originalNumberOfElves = state.units.filter(unit => unit.type === 'Elf').length;
    let elvesHaveDied = true;
    let elfAttackPoints = 3;
    let result;
    const originalState = clonedeep(state);
    while (elvesHaveDied) {
        state = clonedeep(originalState);
        result = runCombat(state, elfAttackPoints, log);
        const numberElvesAlive = result.remainingUnits.filter(unit => unit.type === 'Elf').length;
        if (numberElvesAlive === originalNumberOfElves) {
            elvesHaveDied = false;
        }
        elfAttackPoints++;
    }
    return result.turns * result.remainingUnits.reduce((sum, unit) => {
        return sum + unit.hitPoints;
    }, 0);
};
