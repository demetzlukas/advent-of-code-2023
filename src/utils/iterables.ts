export function intersect<T>(first: Iterable<T>, second: Iterable<T>): Set<T> {
  const intersected: Set<T> = new Set();

  for (const item of first) {
    for (const secondItem of second) {
      if (item == secondItem) {
        intersected.add(item);
        break;
      }
    }
  }

  return intersected;
}
