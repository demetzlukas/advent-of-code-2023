export function sum(a: number, b: number): number {
  return a + b;
}

export function getLCM(values: number[]): number {
  let lcm = 1;
  for (const value of values) {
    lcm = (value * lcm) / getGCD(value, lcm);
  }

  return lcm;
}

export function getGCD(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return getGCD(b, a % b);
}
