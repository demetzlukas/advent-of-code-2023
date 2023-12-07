import { readLinesFromInput, getInputFileName } from '../utils/readFile';

type Hand = {
  cards: string;
  score: number;
  type: number;
};
export async function main() {
  const input = await readLinesFromInput(getInputFileName(__dirname));

  console.log(
    'Part 1:',
    input
      .map((line) => createHand(line))
      .sort((a, b) => compareHands(a, b))
      .map((hand) => hand.score)
      .reduce((a, b, i) => a + b * (i + 1))
  );

  console.log(
    'Part 2:',
    input
      .map((line) => createHand(line, true))
      .sort((a, b) => compareHands(a, b, true))
      .map((hand) => hand.score)
      .reduce((a, b, i) => a + b * (i + 1))
  );
}

function createHand(line: string, partTwo = false): Hand {
  const [cards, score] = line.split(' ');

  return { cards, score: Number(score), type: getType(cards, partTwo) };
}

function getType(hand: string, partTwo = false): number {
  const type = {};
  for (const card of hand.split('')) {
    if (type[card]) {
      type[card]++;
    } else {
      type[card] = 1;
    }
  }

  if (type['J'] && partTwo) {
    const joker = type['J'];
    type['J'] = 0;

    let max = 0;
    let c = 'J';
    for (const card in type) {
      if (type[card] > max) {
        max = type[card];
        c = card;
      }
    }
    type[c] = c !== 'J' ? type[c] + joker : joker;
  }

  const values: number[] = Object.values(type);
  return Number(values.sort().reverse().join('').padEnd(5, '0'));
}

function compareHands(first: Hand, second: Hand, partTwo = false): number {
  if (first.type !== second.type) {
    return first.type - second.type;
  }

  for (let i = 0; i < first.cards.length; i++) {
    const compare = compareCards(first.cards[i], second.cards[i], partTwo);

    if (compare != 0) {
      return compare;
    }
  }
}

function compareCards(
  firstCard: string,
  secondCard: string,
  partTwo = false
): number {
  return replaceCard(firstCard, partTwo) - replaceCard(secondCard, partTwo);
}

function replaceCard(card: string, partTwo = false): number {
  if ('23456789'.includes(card)) {
    return Number(card);
  }
  if (card === 'J' && !partTwo) {
    return 11;
  }
  if (card === 'J' && partTwo) {
    return 1;
  }

  const replacements = {
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
  };

  return replacements[card];
}
