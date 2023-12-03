import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';
import { getAdjacent } from '../utils/arrays';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const foundDigits = new Set<string>();

  for (const [row, line] of input.entries()) {
    for (const [column, c] of line.entries()) {
      if (isSymbol(c)) {
        for (const [x, y] of getAdjacent(row, column, input)) {
          if (isDigit(input[x][y])) {
            foundDigits.add(`${x}x${y}`);
          }
        }
      }
    }
  }

  const numbers: number[] = [];
  for (const entry of foundDigits) {
    const [row, column] = entry.split('x').map(Number);
    numbers.push(getNumberForDigit(row, column, input, foundDigits));
  }

  console.log('Part 1:', numbers.reduce(sum));

  const gearRatios: number[] = [];

  for (const [row, line] of input.entries()) {
    for (const [column, c] of line.entries()) {
      if (c === '*') {
        const foundDigits = new Set<string>();
        for (const [x, y] of getAdjacent(row, column, input)) {
          if (isDigit(input[x][y])) {
            foundDigits.add(`${x}x${y}`);
          }
        }

        const numbers: number[] = [];
        for (const entry of foundDigits) {
          const [row, column] = entry.split('x').map(Number);
          numbers.push(getNumberForDigit(row, column, input, foundDigits));
        }

        if (numbers.length === 2) {
          gearRatios.push(numbers[0] * numbers[1]);
        }
      }
    }
  }

  console.log('Part 2:', gearRatios.reduce(sum));
}

function isDigit(character: string): boolean {
  return '1234567890'.includes(character);
}

function isSymbol(character: string): boolean {
  return !isDigit(character) && character !== '.';
}

function getNumberForDigit(
  row: number,
  column: number,
  input: any[][],
  foundDigits: Set<string>
): number {
  let number = `${input[row][column]}`;

  // go left
  for (let i = column - 1; i >= 0; i--) {
    if (isDigit(input[row][i])) {
      number = input[row][i] + number;
      foundDigits.delete(`${row}x${i}`);
    } else {
      break;
    }
  }

  // go right
  for (let i = column + 1; i < input[row].length; i++) {
    if (isDigit(input[row][i])) {
      number += input[row][i];
      foundDigits.delete(`${row}x${i}`);
    } else {
      break;
    }
  }

  return Number(number);
}
