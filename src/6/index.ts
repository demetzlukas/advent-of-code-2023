import { readLinesFromInput, getInputFileName } from '../utils/readFile';
import { zip } from 'lodash';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(/:\s+/)[1].split(/\s+/).map(Number)
  );

  console.log(
    'Part 1:',
    zip(input[0], input[1])
      .map(([time, distance]) => getCombinations(time, distance))
      .filter((combination) => combination > 0)
      .reduce((a, b) => a * b, 1)
  );

  console.log(
    'Part 2:',
    getCombinations(
      Number(
        input[0].map((value) => value.toString()).reduce((a, b) => a + b, '')
      ),
      Number(
        input[1].map((value) => value.toString()).reduce((a, b) => a + b, '')
      )
    )
  );
}

function getCombinations(time: number, distance: number): number {
  let combination = 0;
  let timePushed = 1;
  while (true) {
    const timeLeft = time - timePushed;
    if (timePushed * timeLeft > distance) {
      combination++;
    }

    if (timeLeft === 0) {
      return combination;
    }

    timePushed++;
  }
}
