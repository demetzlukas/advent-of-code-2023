import { cloneDeep } from 'lodash';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  console.log('Part 1:', getNumberOfEnergizedTiles(0, 0, input, 'R'));

  let maxValue = 0;
  for (let i = 0; i < input[0].length; i++) {
    maxValue = Math.max(maxValue, getNumberOfEnergizedTiles(0, i, input, 'D'));
  }

  for (let i = 0; i < input[0].length; i++) {
    maxValue = Math.max(
      maxValue,
      getNumberOfEnergizedTiles(input.length - 1, i, input, 'U')
    );
  }

  for (let i = 0; i < input.length; i++) {
    maxValue = Math.max(maxValue, getNumberOfEnergizedTiles(i, 0, input, 'R'));
  }

  for (let i = 0; i < input.length; i++) {
    maxValue = Math.max(
      maxValue,
      getNumberOfEnergizedTiles(i, input[0].length - 1, input, 'L')
    );
  }

  console.log('Part 2:', maxValue);
}

function move(
  x: number,
  y: number,
  field: string[][],
  direction: string,
  energized: Set<string>,
  seen: Set<string>
) {
  while (true) {
    if (x < 0 || x >= field.length || y < 0 || y >= field[0].length) {
      return;
    }
    if (seen.has(direction + getKey(x, y))) {
      return;
    }
    seen.add(direction + getKey(x, y));
    energized.add(getKey(x, y));

    const cell = field[x][y];
    if (cell === '|' && 'LR'.includes(direction)) {
      move(x - 1, y, field, 'U', energized, seen);
      move(x + 1, y, field, 'D', energized, seen);
      return;
    }
    if (cell === '-' && 'UD'.includes(direction)) {
      move(x, y - 1, field, 'L', energized, seen);
      move(x, y + 1, field, 'R', energized, seen);
      return;
    }

    direction = getNextDirection(direction, cell);
    const [dx, dy] = getNext(direction);
    x += dx;
    y += dy;
  }
}

function getNumberOfEnergizedTiles(
  x: number,
  y: number,
  field: string[][],
  direction: string
): number {
  const energized = new Set<string>();
  const seen = new Set<string>();
  move(x, y, field, direction, energized, seen);

  return energized.size;
}

function getKey(x: number, y: number): string {
  return `${x}x${y}`;
}

function getNextDirection(direction: string, cell: string): string {
  if ('.-|'.includes(cell)) {
    return direction;
  }
  const directions = {
    '/': {
      R: 'U',
      L: 'D',
      U: 'R',
      D: 'L',
    },
    '\\': {
      R: 'D',
      L: 'U',
      U: 'L',
      D: 'R',
    },
  };

  return directions[cell][direction];
}

function getNext(direction: string): [number, number] {
  const deltas = {
    R: [0, 1],
    L: [0, -1],
    U: [-1, 0],
    D: [1, 0],
  };

  return deltas[direction];
}
