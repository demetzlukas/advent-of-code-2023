import { cloneDeep, zip } from 'lodash';
import { getInputFileName, readFileFromInput } from '../utils/readFile';
import { rotate } from '../utils/arrays';
import { sum } from '../utils/math';

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname)))
    .split('\r\n\r\n')
    .map((part) => part.split('\r\n'));

  console.log(
    'Part 1:',
    input.map((pattern) => getSummary(pattern)).reduce(sum)
  );
  console.log(
    'Part 2:',
    input.map((pattern) => getSummary(pattern, true)).reduce(sum)
  );
}

function getHorizontal(pattern: string[], partTwo = false): number {
  for (let i = 1; i < pattern.length; i++) {
    let smudge = false;
    let counter = 0;

    let up = i - 1;
    let down = i;

    while (up >= 0 && down < pattern.length) {
      const difference = getDifference(pattern[up], pattern[down]);
      if (difference === 0) {
        counter++;
      } else if (difference === 1 && !smudge && partTwo) {
        counter++;
        smudge = true;
      } else {
        break;
      }
      up--;
      down++;
    }

    if (
      counter > 0 &&
      (up < 0 || down === pattern.length) &&
      (smudge || !partTwo)
    ) {
      return i;
    }
  }

  return 0;
}

function getVertical(pattern: string[], partTwo = false): number {
  const flipped = rotate(cloneDeep(pattern).map((line) => line.split(''))).map(
    (line) => line.join('')
  );
  return getHorizontal(flipped, partTwo);
}

function getSummary(pattern: string[], partTwo = false) {
  return getVertical(pattern, partTwo) + getHorizontal(pattern, partTwo) * 100;
}

function getDifference(stringA: string, stringB: string): number {
  return zip(stringA.split(''), stringB.split('')).filter(([a, b]) => a !== b)
    .length;
}
