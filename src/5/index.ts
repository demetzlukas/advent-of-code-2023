import { chunk } from 'lodash';
import { getInputFileName, readFileFromInput } from '../utils/readFile';

type MapRange = {
  ranges: {
    source: number;
    destination: number;
    range: number;
  }[];
};

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname))).split(
    '\r\n\r\n'
  );

  const seeds = input.shift().split(': ').pop().split(' ').map(Number);

  const maps: MapRange[] = input.map((block) => ({
    ranges: block
      .split('\r\n')
      .slice(1)
      .map((line) => line.split(' ').map(Number))
      .map(([destination, source, range]) => ({
        source,
        destination,
        range,
      })),
  }));

  console.log(
    'Part 1:',
    Math.min(...seeds.map((seed) => findLocation(seed, maps)))
  );

  for (let i = 0; i < 1_000_000_000; i++) {
    const seed = findSeedForLocation(i, maps);
    if (isValidSeed(seed, seeds)) {
      console.log('Part 2:', i);
      break;
    }
  }

  // Slow version
  // let min = Number.MAX_VALUE;

  // for (const [start, range] of chunk(seeds, 2)) {
  //   for (let seed = start; seed < start + range; seed++) {
  //     min = Math.min(findLocation(seed, maps), min);
  //   }
  // }

  // console.log('Part 2:', min);
}

function sourceToDestination(seed: number, { ranges }: MapRange): number {
  for (const { source, destination, range } of ranges) {
    if (seed >= source && seed < source + range) {
      return destination + Math.abs(seed - source);
    }
  }
  return seed;
}

function findLocation(seed: number, maps: MapRange[]): number {
  for (const map of maps) {
    seed = sourceToDestination(seed, map);
  }

  return seed;
}

function findSeedForLocation(location: number, maps: MapRange[]): number {
  for (const map of maps.slice().reverse()) {
    location = destinationToSource(location, map);
  }

  return location;
}

function destinationToSource(seed: number, { ranges }: MapRange): number {
  for (const { source, destination, range } of ranges) {
    if (seed >= destination && seed < destination + range) {
      return source + seed - destination;
    }
  }
  return seed;
}

function isValidSeed(seed: number, seeds: number[]): boolean {
  const groupedSeeds = chunk(seeds, 2);
  return groupedSeeds.some(
    ([start, range]) => seed >= start && seed < start + range
  );
}
