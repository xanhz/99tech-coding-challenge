// Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER
// Number.MAX_SAFE_INTEGER = 9_007_199_254_740_991 => n in range [1, 134_217_727]

/**
 * - Cons: Slow and may be exceed stack size
 * - Time complexity: O(n)
 * - Space complexity: O(n)
 */
function sumToNRecursive(n: number): number {
  if (n <= 1) {
    return n;
  }
  return n + sumToNRecursive(n - 1);
}

/**
 * - Pros: Easy
 * - Cons: Time increase by n
 * - Time complexity: O(n)
 * - Space complexity: O(1)
 */
function sumToNLoop(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * - Pros: Fastest, easy
 * - Time complexity: O(1)
 * - Space complexity: O(1)
 */
function sumToNFormula(n: number): number {
  return (n * (n + 1)) / 2;
}
