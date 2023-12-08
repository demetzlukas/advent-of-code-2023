import { readLinesFromInput, getInputFileName } from '../utils/readFile';

type Node = {
  name: string;
  left: string;
  right: string;
};

export async function main() {
  const input = await readLinesFromInput(getInputFileName(__dirname));

  const instructions = input.shift();

  const regex = /(.{3}) = \((.{3}), (.{3})\)/;
  const nodes: Node[] = input
    .slice(1)
    .map((line) => line.match(regex).slice(1, 4))
    .map(([name, left, right]) => ({ name, left, right }));

  console.log(
    'Part 1:',
    getSteps(getNode('AAA', nodes), nodes, instructions, 'ZZZ')
  );

  const steps = nodes
    .filter(({ name }) => name.endsWith('A'))
    .map((node) => getSteps(node, nodes, instructions, 'Z'));
  console.log('Part 2:', getLCM(steps));
}

function getNode(nodeName: string, nodes: Node[]): Node {
  return nodes.find(({ name }) => name === nodeName);
}

function getSteps(
  node: Node,
  nodes: Node[],
  instructions: string,
  endsWith: string
): number {
  let steps = 0;
  while (!node.name.endsWith(endsWith)) {
    const direction = instructions[steps % instructions.length];
    node = getNode(direction === 'L' ? node.left : node.right, nodes);

    steps++;
  }

  return steps;
}

function getLCM(values: number[]): number {
  let lcm = 1;
  for (const value of values) {
    lcm = (value * lcm) / getGCD(value, lcm);
  }

  return lcm;
}

function getGCD(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return getGCD(b, a % b);
}
