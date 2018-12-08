import Logger = require('bunyan');

type Node = {
    children: Node[],
    metadata: number[]
}

export const parseNumbers = (numbers: number[]): Node => {
    return findNodes(numbers).nodes;
};

export const findNodes = (numbers: number[]): { numbers: number[], nodes: Node } => {
    const numChildren: number = numbers.shift();
    const numMetadata = numbers.shift();
    const children: Node[] = [];
    const metadata: number[] = [];
    for (let child = 1; child <= numChildren; child++) {
        const childNodes = findNodes(numbers);
        numbers = childNodes.numbers;
        children.push(childNodes.nodes);
    }
    for (let metadatum = 1; metadatum <= numMetadata; metadatum++) {
        metadata.push(numbers.shift());
    }
    return { numbers, nodes: { children, metadata } };
};

export const sumMetadata = (node: Node, sum: number): number => {
    sum = node.children.reduce((sum, child) => {
        return sumMetadata(child, sum);
    }, sum);
    return node.metadata.reduce((sum, metadatum) => {
        return sum + metadatum;
    }, sum);
};

export const parse = (rawInput: string[], _log: Logger): number[] => {
    return rawInput[0].split(' ').map(element => parseInt(element, 10));
};

export const run1 = (numbers: number[], _log: Logger): number => {
    return sumMetadata(parseNumbers(numbers), 0);
};
