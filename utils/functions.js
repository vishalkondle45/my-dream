export const getInitials = (name) => {
  return (
    name?.split(" ")[0][0] + name?.split(" ")[name?.split(" ")?.length - 1][0]
  );
};

export function isPrime(n) {
  if (n == 0 || n == 1) return false;
  for (let i = 2; i * i <= n; i++) if (n % i == 0) return false;

  return true;
}

export function getSum(n) {
  let sum = 0;
  while (n > 0 || sum > 9) {
    if (n == 0) {
      n = sum;
      sum = 0;
    }
    sum = sum + (n % 10);
    n = Math.floor(n / 10);
  }
  return sum;
}

export function sumAscii(str) {
  let sum = 0;
  for (let i = 0; i < str?.length; i++) {
    if (isPrime(i + 1)) sum += str.charCodeAt(i);
  }
  return getSum(sum);
}
