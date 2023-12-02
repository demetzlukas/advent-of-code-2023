import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

const maxCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(': ')
  );

  const partOne = input
    .filter(([_, game]) => isValidGame(game))
    .map(([game]) => Number(game.split(' ')[1]))
    .reduce(sum);

  const partTwo = input
    .map(([_, rounds]) => getMinimumNumber(rounds))
    .reduce(sum);

  console.log('Part 1:', partOne);
  console.log('Part 2:', partTwo);
}

function isValidGame(game: string): boolean {
  return getRounds(game).every((round) => isValidRound(round));
}

function isValidRound(round: string[]): boolean {
  return round.every((cube) => isValid(cube.split(' ')));
}

function isValid([times, color]: string[]): boolean {
  return Number(times) <= maxCubes[color];
}

function getMinimumNumber(game: string): number {
  const tempMaxCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const round of getRounds(game)) {
    for (const cube of round) {
      const [times, color] = cube.split(' ');
      tempMaxCubes[color] = Math.max(tempMaxCubes[color], Number(times));
    }
  }

  return tempMaxCubes['red'] * tempMaxCubes['green'] * tempMaxCubes['blue'];
}

function getRounds(game: string) {
  return game.split('; ').map((round) => round.split(', '));
}
