import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

const digits = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

export async function main() {
  const input = await readLinesFromInput(getInputFileName(__dirname));

  const partOne = input.map((line) => getNumbers(line)).reduce(sum);
  const partTwo = input.map((line) => getNumbers(line, true)).reduce(sum);

  console.log('Part 1:', partOne);
  console.log('Part 2:', partTwo);
}

function getNumbers(line: string, partTwo = false): number {
  return Number(
    `${getFirstNumber(line, partTwo)}${getLastNumber(line, partTwo)}`
  );
}

function getFirstNumber(line: string, partTwo = false): string {
  while (line.length > 0) {
    for (const [index, digit] of digits.entries()) {
      if (
        line.startsWith(`${index + 1}`) ||
        (line.startsWith(digit) && partTwo)
      ) {
        return `${index + 1}`;
      }
    }

    line = line.slice(1);
  }

  throw new Error('no digit found');
}

function getLastNumber(line: string, partTwo = false): string {
  while (line.length > 0) {
    for (const [index, digit] of digits.entries()) {
      if (line.endsWith(`${index + 1}`) || (line.endsWith(digit) && partTwo)) {
        return `${index + 1}`;
      }
    }

    line = line.slice(0, -1);
  }

  throw new Error('no digit found');
}
