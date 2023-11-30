import {
  Box,
  Divider,
  Group,
  NumberFormatter,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconDiscountCheck,
  IconDiscountCheckFilled,
  IconReceipt,
} from "@tabler/icons-react";
import dayjs from "dayjs";

const Expenses = ({
  expense,
  splitAmong,
  paidBy,
  users,
  user,
  setSelectedExpense,
}) => {
  const remaining =
    (paidBy?.find((item) => item.user === user?.subject)?.amount || 0) -
    (splitAmong?.find((item) => item.user === user?.subject)?.amount || 0);
  return (
    <>
      <Paper
        style={{ cursor: "pointer" }}
        mt="sm"
        onClick={() => setSelectedExpense(expense)}
      >
        <Text size="xs">{dayjs(expense.date).format("MMM DD")}</Text>
        <Group justify="space-between">
          <Group>
            <ThemeIcon variant="light">
              {expense?.isSettlement ? (
                <IconDiscountCheckFilled size={18} />
              ) : (
                <IconReceipt size={18} />
              )}
            </ThemeIcon>
            <Box>
              {expense?.isSettlement ? (
                <Group gap="xs">
                  <Text fw={700}>
                    {paidBy[0]?.user === user?.subject
                      ? "You"
                      : users
                          .find((item) => item.userId === paidBy[0]?.user)
                          ?.name.split(" ")[0]}
                  </Text>
                  <Text>Paid</Text>
                  <Text fw={700}>
                    {splitAmong[0]?.user === user?.subject
                      ? "You"
                      : users
                          .find((item) => item.userId === splitAmong[0]?.user)
                          ?.name.split(" ")[0]}
                  </Text>
                </Group>
              ) : (
                <Text size="sm" fw={700}>
                  {expense?.description}
                </Text>
              )}
              {!expense?.isSettlement && (
                <Text size="sm" fw={300}>
                  {paidBy?.length > 1
                    ? `${paidBy?.length} people`
                    : users
                        .find((item) => item.userId === paidBy[0]?.user)
                        ?.name.split(" ")[0]}{" "}
                  paid $ {expense?.amount}
                </Text>
              )}
            </Box>
          </Group>
          <Group justify="right">
            <Text
              size="sm"
              c={remaining ? (remaining < 0 ? "red" : "green") : "gray"}
            >
              {remaining ? (
                <NumberFormatter
                  allowNegative={false}
                  value={remaining}
                  prefix="₹ "
                  thousandsGroupStyle="lakh"
                  thousandSeparator
                />
              ) : (
                "not involved"
              )}
            </Text>
          </Group>
        </Group>
      </Paper>
      <Divider my="sm" />
    </>
  );
};

export default Expenses;
