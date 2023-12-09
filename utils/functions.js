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

export const getBalance = (expenses, paidBy, splitAmong, user, item) => {
  const getPaidBy = (expense, user) =>
    paidBy?.find(
      (paid) => expense?._id === paid?.expense && paid?.user === user
    )?.amount || 0;
  const getSplitAmong = (expense, user) =>
    splitAmong?.find(
      (split) => expense?._id === split?.expense && split?.user === user
    )?.amount || 0;
  const getPercentage = (divide, divider) => (divide / divider) * 100;

  return expenses.map((expense) => {
    return {
      expense_amount: expense?.amount,
      user_paidBy: getPaidBy(expense, user?.subject),
      user_paidByPercentage: getPaidBy(expense, user?.subject)
        ? getPercentage(getPaidBy(expense, user?.subject), expense?.amount)
        : 0,
      user_splitAmong: getSplitAmong(expense, user?.subject),
      selected_paidBy: getPaidBy(expense, item?.userId),
      selected_splitAmong: getSplitAmong(expense, item?.userId),
      balance:
        getPaidBy(expense, item?.userId) - getSplitAmong(expense, item?.userId),
      user_paid: getPaidBy(expense, user?.subject),
    };
  });
};
