/**
 * @template T
 * @param {T[]} values
 * @param {number} count
 * @returns {T[][]}
 */
export function combinationsOf(values, count) {
  if (count === 0) {
    return [];
  }

  if (values.length < count) {
    return [];
  }

  if (count === 1) {
    return values.map((value) => [value]);
  }

  const [first, ...others] = values;

  const combinationsWithoutFirst = combinationsOf(others, count - 1);

  const combinationsWithFirst = combinationsWithoutFirst.map((combination) => {
    return [first, ...combination];
  });

  const othersCombinations = combinationsOf(others, count) ?? [];

  return combinationsWithFirst.concat(othersCombinations);
}

/**
 * @param {number} n
 * @param {number} k
 * @returns {number} - The number of combinations.
 */
export function combinationsLength(system) {
  const [k, n] = system;
  if (k > n || k < 0) {
    return 0;
  }
  if (k === 0 || k === n) {
    return 1;
  }

  const factorial = (num) => (num <= 1 ? 1 : num * factorial(num - 1));

  return factorial(n) / (factorial(k) * factorial(n - k));
}

export const systems = [
  [2, 3],
  [2, 4],
  [3, 4],
  [2, 5],
  [3, 5],
  [4, 5],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
];
