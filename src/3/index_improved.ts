import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';
import { getAdjacent } from '../utils/arrays';

type Symbol = {
  symbol: string;
  row: number;
  column: number;
  adjacentNumbers: number[];
};

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const symbolsWithAdjacentNumbers: Symbol[] = [];

  input.forEach((line, row) => {
    line.forEach((c, column) => {
      if (isSymbol(c)) {
        const symbol: Symbol = {
          symbol: c,
          row: row,
          column: column,
          adjacentNumbers: [],
        };
        symbol.adjacentNumbers = getAdjacentNumbers(
          symbol.row,
          symbol.column,
          input
        );

        symbolsWithAdjacentNumbers.push(symbol);
      }
    });
  });

  console.log(
    'Part 1:',
    symbolsWithAdjacentNumbers
      .flatMap(({ adjacentNumbers }) => adjacentNumbers)
      .reduce(sum)
  );

  console.log(
    'Part 2:',
    symbolsWithAdjacentNumbers
      .filter(({ symbol }) => symbol === '*')
      .filter(({ adjacentNumbers }) => adjacentNumbers.length === 2)
      .map(({ adjacentNumbers }) => adjacentNumbers.reduce((a, b) => a * b, 1))
      .reduce(sum)
  );
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
    if (!isDigit(input[row][i])) {
      break;
    }
    number = input[row][i] + number;
    foundDigits.delete(`${row}x${i}`);
  }

  // go right
  for (let i = column + 1; i < input[row].length; i++) {
    if (!isDigit(input[row][i])) {
      break;
    }
    number += input[row][i];
    foundDigits.delete(`${row}x${i}`);
  }

  return Number(number);
}

function getAdjacentNumbers(
  row: number,
  column: number,
  input: string[][]
): number[] {
  const foundDigits = new Set<string>(
    getAdjacent(row, column, input)
      .filter(([x, y]) => isDigit(input[x][y]))
      .map(([x, y]) => `${x}x${y}`)
  );

  const numbers: number[] = [];
  for (const entry of foundDigits) {
    const [row, column] = entry.split('x').map(Number);
    numbers.push(getNumberForDigit(row, column, input, foundDigits));
  }

  return numbers;
}
