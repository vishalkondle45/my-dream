import { Box, Text } from "@mantine/core";
import Expense from "./Expense";

const Expenses = ({ expenses, splitAmong, paidBy, users, user }) => {
  return (
    <Box mt="xs">
      {expenses?.map((expense) => (
        <Expense
          key={expense._id}
          expense={expense}
          splitAmong={splitAmong?.filter(
            (item) => item.expense === expense._id
          )}
          paidBy={paidBy?.filter((item) => item.expense === expense._id)}
          users={users}
          user={user}
        />
      ))}
      <Text c="gray" ta="center">
        No more bills to show
      </Text>
    </Box>
  );
};

export default Expenses;
