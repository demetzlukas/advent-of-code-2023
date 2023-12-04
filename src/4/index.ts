import { intersect } from '../utils/iterables';
import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(': ')
  );

  let partOne = 0;
  const factors = Array.from({ length: input.length + 1 }, () => 1);

  for (const [_, game] of input) {
    const id = Number(_.split(/\s+/)[1]);
    const [winningNumbers, myNumbers] = game.split(' | ').map((part) =>
      part
        .split(/\s+/)
        .filter((line) => line !== '')
        .map(Number)
    );

    const winningCards = intersect(winningNumbers, myNumbers);
    if (winningCards.size > 0) {
      partOne += Math.pow(2, winningCards.size - 1);
      for (let i = 0; i < winningCards.size; i++) {
        factors[id + i + 1] += factors[id];
      }
    }
  }

  console.log('Part 1:', partOne);
  console.log('Part 2:', factors.slice(1).reduce(sum));
}
