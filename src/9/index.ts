import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname)))
    .map((line) => line.split(' ').map(Number))
    .map(addHistory);

  input.forEach((line) => addHistoryEnd(line));

  console.log(
    'Part 1:',
    input
      .map((line) => line[0])
      .flatMap((values) => values[values.length - 1])
      .reduce(sum)
  );

  input.forEach((line) => addHistoryBeginning(line));
  console.log(
    'Part 2:',
    input
      .map((line) => line[0])
      .flatMap((values) => values[0])
      .reduce(sum)
  );
}

function addHistory(line: number[]): number[][] {
  const history = [line];

  while (true) {
    const newLine: number[] = [];
    const lastLine = history.slice(-1)[0];

    for (let i = 0; i < lastLine.length - 1; i++) {
      newLine.push(lastLine[i + 1] - lastLine[i]);
    }

    history.push(newLine);
    if (newLine.filter((value) => value !== 0).length === 0) {
      return history;
    }
  }
}

function addHistoryEnd(lines: number[][]): number[][] {
  lines.reverse();

  lines[0].push(0);
  for (let i = 0; i < lines.length - 1; i++) {
    const thisLine = lines[i];
    const nextLine = lines[i + 1];
    nextLine.push(
      thisLine[thisLine.length - 1] + nextLine[nextLine.length - 1]
    );
  }

  return lines.reverse();
}

function addHistoryBeginning(lines: number[][]): number[][] {
  lines.reverse();

  lines[0].unshift(0);
  for (let i = 0; i < lines.length - 1; i++) {
    const thisLine = lines[i];
    const nextLine = lines[i + 1];
    nextLine.unshift(nextLine[0] - thisLine[0]);
  }

  return lines.reverse();
}
