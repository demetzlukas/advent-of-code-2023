import { cloneDeep } from 'lodash';
import { rotate } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  let input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );
  const galaxies = findGalaxies(input);

  console.log('Part 1:', calculateDistances(adaptGalaxies(galaxies, input)));
  console.log(
    'Part 2:',
    calculateDistances(adaptGalaxies(galaxies, input, 1000000 - 1))
  );
}

function adaptGalaxies(
  galaxies: [number, number][],
  universe: string[][],
  multiplier = 1
): [number, number][] {
  let insertedRows = 0;
  const adaptedGalaxies = cloneDeep(galaxies);

  for (const [i, row] of universe.entries()) {
    if (row.every((char) => char === '.')) {
      const toAdapt = adaptedGalaxies.filter(
        ([x]) => x >= i + insertedRows * multiplier
      );
      for (let j = 0; j < toAdapt.length; j++) {
        toAdapt[j][0] += multiplier;
      }
      insertedRows++;
    }
  }

  let insertedColumns = 0;

  for (const [i] of universe[0].entries()) {
    if (universe.map((line) => line[i]).every((char) => char === '.')) {
      const toAdapt = adaptedGalaxies.filter(
        ([_, y]) => y >= i + insertedColumns * multiplier
      );
      for (let j = 0; j < toAdapt.length; j++) {
        toAdapt[j][1] += multiplier;
      }
      insertedColumns++;
    }
  }

  return adaptedGalaxies;
}

function calculateDistances(galaxies: [number, number][]) {
  let distance = 0;
  while (galaxies.length > 0) {
    const galaxy = galaxies.shift();

    for (const otherGalaxy of galaxies) {
      distance += getDistance(galaxy, otherGalaxy);
    }
  }

  return distance;
}

function print(array: any[][]) {
  console.log(array.map((line) => line.join('')).join('\n'));
}

function expand(input: any[][]): any[][] {
  const expanded = cloneDeep(input);
  let insertedRow = 0;

  for (const [i, row] of input.entries()) {
    if (row.every((char) => char === '.')) {
      insertedRow++;
      const emptyRow = Array.from({ length: row.length }, () => '.');
      expanded.splice(i + insertedRow, 0, emptyRow);
    }
  }

  return expanded;
}

function expandUniverse(input: any[][]): any[][] {
  let expanded: string[][] = expand(input);

  expanded = rotate(expanded);
  expanded = expand(expanded);
  expanded = rotate(expanded);
  expanded = rotate(expanded);
  return rotate(expanded);
}

function findGalaxies(universe: any[][]): [number, number][] {
  const galaxies: [number, number][] = [];

  for (const [x, row] of universe.entries()) {
    for (const [y, char] of row.entries()) {
      if (char === '#') {
        galaxies.push([x, y]);
      }
    }
  }

  return galaxies;
}

function getDistance(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
