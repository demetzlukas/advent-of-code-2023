import { cloneDeep } from 'lodash';
import { rotate } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  let input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const inputPartOne = cloneDeep(input);
  tiltNorth(inputPartOne);
  console.log('Part 1:', getWeight(inputPartOne));

  const map = new Map<string, number>();
  let cycleStart = 0;
  let cycleEnd = 0;

  for (let j = 0; j < 1000000000; j++) {
    for (let direction = 0; direction < 4; direction++) {
      tiltNorth(input);
      input = rotate(input);
    }
    const string = toString(input);
    if (map.has(string)) {
      const value = map.get(string);
      if (value === 2 && cycleStart === 0) {
        cycleStart = j;
      }
      if (value === 3) {
        cycleEnd = j;
        break;
      }
      map.set(string, value + 1);
    } else {
      map.set(string, 1);
    }
  }

  const cycleLength = cycleEnd - cycleStart;
  const offset = (1000000000 - cycleStart) % cycleLength;

  for (let j = 0; j < offset - 1; j++) {
    for (let direction = 0; direction < 4; direction++) {
      tiltNorth(input);
      input = rotate(input);
    }
  }

  console.log('Part 2:', getWeight(input));
}

function tiltNorth(input: string[][]) {
  input.push(Array.from({ length: input[0].length }, () => '#'));
  for (let column = 0; column < input.length; column++) {
    let row = 0;
    let numberOfRocks = 0;
    let empty = 0;
    let start = 0;
    while (row < input.length) {
      if (input[row][column] === 'O') {
        numberOfRocks++;
      } else if (input[row][column] === '.') {
        empty++;
      } else {
        for (let i = 0; i < numberOfRocks; i++) {
          input[start + i][column] = 'O';
        }
        for (let i = 0; i < empty; i++) {
          input[start + numberOfRocks + i][column] = '.';
        }
        start = row + 1;
        empty = 0;
        numberOfRocks = 0;
      }
      row++;
    }
  }
  input.pop();
}

function getWeight(input: string[][]) {
  let sum = 0;

  for (let row = 0; row < input.length; row++) {
    for (let column = 0; column < input[0].length; column++) {
      if (input[row][column] === 'O') {
        sum += input.length - row;
      }
    }
  }
  return sum;
}

function toString(input: string[][]): string {
  return input.map((line) => line.join('')).join('-');
}
