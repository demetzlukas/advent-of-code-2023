import { sum } from '../utils/math';
import { getInputFileName, readFileFromInput } from '../utils/readFile';

type Lens = {
  label: string;
  value: number;
};

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname))).split(
    ','
  );

  console.log('Part 1:', input.map(getHash).reduce(sum));

  const boxes: Lens[][] = Array.from({ length: 256 }, () => []);

  for (const entry of input) {
    const [l, value] = entry.split(/[=-]/);
    const hash = getHash(l);
    const index = boxes[hash].findIndex(({ label }) => l === label);

    if (entry.includes('=')) {
      const lens = { label: l, value: Number(value) };
      if (index !== -1) {
        boxes[hash][index] = lens;
      } else {
        boxes[hash].push(lens);
      }
    } else {
      if (index !== -1) {
        boxes[hash].splice(index, 1);
      }
    }
  }

  let answer = 0;
  for (const [i, box] of boxes.entries()) {
    for (const [j, lens] of box.entries()) {
      answer += (i + 1) * (j + 1) * lens.value;
    }
  }

  console.log('Part 2:', answer);
}

function getHash(string: string): number {
  let value = 0;
  for (const char of string.split('')) {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  }

  return value;
}
