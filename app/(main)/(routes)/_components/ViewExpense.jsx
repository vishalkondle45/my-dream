import { api } from "@/convex/_generated/api";
import { colors } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconPencil,
  IconReceipt,
  IconShare,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import dayjs from "dayjs";

const ViewExpense = ({
  editExpenseHandlers,
  selectedExpense,
  paidBy,
  splitAmong,
  users,
  setSelectedExpense,
  user,
}) => {
  const deleteExpense = useMutation(api.expense.deleteExpense);

  return (
    <>
      <Paper shadow="xl" withBorder px="md" py="xs">
        <Group gap="xs" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="filled" size="lg">
              <IconReceipt size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={500}>
                {selectedExpense?.description}
              </Text>
              <Text size="sm" fw={300}>
                {dayjs(selectedExpense?.date).format("DD MMM YYYY")}
              </Text>
              <NumberFormatter
                allowNegative={false}
                value={selectedExpense?.amount}
                prefix="₹ "
                thousandsGroupStyle="lakh"
                thousandSeparator
                size="sm"
                fw={500}
              />
            </Stack>
          </Group>
          <Stack>
            <Group gap="xs" justify="right" wrap="nowrap">
              <ActionIcon
                variant="light"
                onClick={() => editExpenseHandlers.open()}
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                onClick={() => {
                  deleteExpense({ expense: selectedExpense._id });
                  setSelectedExpense(null);
                  editExpenseHandlers.close();
                }}
              >
                <IconTrashFilled size={16} />
              </ActionIcon>
              <ActionIcon variant="light">
                <IconShare size={16} />
              </ActionIcon>
            </Group>
            <Badge size="xs">
              added on {dayjs(selectedExpense?._creationTime).format("DD MMM")}
            </Badge>
          </Stack>
        </Group>
      </Paper>
      <Paper shadow="xl" mt="md" p="sm" withBorder>
        <Text mb="xs" fw="bolder">
          Paid By
        </Text>
        {paidBy
          ?.filter((item) => item.expense === selectedExpense?._id)
          ?.map((item) => (
            <Group mb="xs" key={item._id} justify="space-between">
              <Group gap="xs">
                <Avatar
                  size="sm"
                  color={
                    colors[
                      sumAscii(
                        users.find((user) => user.userId === item?.user).name
                      ) - 1
                    ]
                  }
                >
                  {getInitials(
                    users.find((user) => user.userId === item?.user).name
                  )}
                </Avatar>
                <Text>
                  {item?.user === user.subject
                    ? "You"
                    : users.find((user) => user.userId === item?.user).name}
                </Text>
              </Group>
              <NumberFormatter
                allowNegative={false}
                value={item.amount}
                prefix="₹ "
                thousandsGroupStyle="lakh"
                thousandSeparator
              />
            </Group>
          ))}
        <Divider my="xs" variant="dashed" />
        <Text mb="xs" fw="bolder">
          Split Among
        </Text>
        {splitAmong
          ?.filter((item) => item.expense === selectedExpense?._id)
          ?.map((item) => (
            <Group mb="xs" key={item._id} justify="space-between">
              <Group gap="xs">
                <Avatar
                  size="sm"
                  color={
                    colors[
                      sumAscii(
                        users.find((user) => user.userId === item?.user).name
                      ) - 1
                    ]
                  }
                >
                  {getInitials(
                    users.find((user) => user.userId === item?.user).name
                  )}
                </Avatar>
                <Text>
                  {item?.user === user.subject
                    ? "You"
                    : users.find((user) => user.userId === item?.user).name}
                </Text>
              </Group>
              <NumberFormatter
                allowNegative={false}
                value={item.amount}
                prefix="₹ "
                thousandsGroupStyle="lakh"
                thousandSeparator
              />
            </Group>
          ))}
      </Paper>
    </>
  );
};

export default ViewExpense;
