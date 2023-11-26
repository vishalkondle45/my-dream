import { colors } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
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
import dayjs from "dayjs";

const ViewExpense = ({
  editExpenseHandlers,
  selectedExpense,
  paidBy,
  splitAmong,
  users,
}) => {
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
          <Group gap="xs" justify="right" wrap="nowrap">
            <ActionIcon
              variant="light"
              onClick={() => {
                editExpenseHandlers.open();
              }}
            >
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon variant="light">
              <IconTrashFilled size={16} />
            </ActionIcon>
            <ActionIcon variant="light">
              <IconShare size={16} />
            </ActionIcon>
          </Group>
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
                  {users.find((user) => user.userId === item?.user).name}
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
                  {users.find((user) => user.userId === item?.user).name}
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
