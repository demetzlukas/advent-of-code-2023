import { readLinesFromInput, getInputFileName } from '../utils/readFile';

const pipes = {
  '|': {
    N: 'N',
    S: 'S',
  },
  '-': {
    E: 'E',
    W: 'W',
  },
  L: {
    S: 'E',
    W: 'N',
  },
  J: {
    S: 'W',
    E: 'N',
  },
  '7': {
    N: 'W',
    E: 'S',
  },
  F: {
    N: 'E',
    W: 'S',
  },
};

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  let [x, y] = getStartPosition(input);
  let cycle: Set<string> = null;

  for (const type in pipes) {
    const pipe = pipes[type];
    input[x][y] = type;
    const cycles = Object.keys(pipe)
      .map((direction) => getCycle(x, y, direction, input))
      .filter((cycle) => cycle !== null);
    if (cycles.length === 2) {
      cycle = cycles[0];
      break;
    }
  }

  console.log('Part 1:', cycle.size / 2);

  for (const [x, row] of input.entries()) {
    for (const [y] of row.entries()) {
      if (!cycle.has(getKey(x, y))) {
        input[x][y] = '.';
      }
    }
  }

  let inside = 0;

  for (const [x, row] of input.entries()) {
    for (const [y, char] of row.entries()) {
      if (char !== '.') {
        continue;
      }
      let pipes = 0;
      for (let i = y + 1; i < row.length; i++) {
        if ('|JL'.includes(input[x][i])) {
          pipes++;
        }
      }
      if (pipes % 2 === 1) {
        inside++;
      }
    }
  }

  // not submitted as idea was taken from reddit
  console.log('Part 2:', inside);
}

function getStartPosition(input: string[][]): [number, number] {
  for (const [x, line] of input.entries()) {
    for (const [y, char] of line.entries()) {
      if (char === 'S') {
        return [x, y];
      }
    }
  }

  throw new Error('No starting position');
}

function getKey(x: number, y: number): string {
  return `${x}x${y}`;
}

function getNext(direction: string): [number, number] {
  const directions = {
    N: [-1, 0],
    S: [1, 0],
    E: [0, 1],
    W: [0, -1],
  };

  return directions[direction];
}

function getCycle(
  x: number,
  y: number,
  direction: string,
  input: string[][]
): Set<string> {
  const seenTiles = new Set<string>();
  while (!seenTiles.has(getKey(x, y))) {
    seenTiles.add(getKey(x, y));
    if (input[x][y] === '.') {
      return null;
    }
    const pipe = pipes[input[x][y]];
    if (!pipe || !Object.keys(pipe).includes(direction)) {
      return null;
    }
    direction = pipe[direction];
    const [nextX, nextY] = getNext(direction);
    x += nextX;
    y += nextY;
  }

  return seenTiles;
}
