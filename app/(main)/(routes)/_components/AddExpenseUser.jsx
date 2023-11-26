import { colors } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
  Group,
  NumberInput,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import {
  IconCircle,
  IconCircleCheckFilled,
  IconCurrencyRupee,
} from "@tabler/icons-react";

const AddExpenseUser = ({
  user,
  paidBy,
  selectUser,
  withAmount = false,
  form,
  currentUser,
}) => {
  return (
    <Paper p={rem(4)} withBorder>
      <Group justify="space-between">
        <Group gap="xs" wrap="nowrap">
          <ActionIcon onClick={selectUser} variant="transparent">
            {paidBy?.find((item) => item?.user === user?.userId) ? (
              <IconCircleCheckFilled />
            ) : (
              <IconCircle />
            )}
          </ActionIcon>
          <Avatar
            size="sm"
            color={colors[sumAscii(user?.name) - 1]}
            radius="xl"
          >
            {getInitials(user?.name)}
          </Avatar>
          <Text size="sm">
            {user?.userId === currentUser.subject ? "You" : user?.name}
          </Text>
        </Group>
        {withAmount && (
          <NumberInput
            type="number"
            min={0}
            readOnly={!paidBy?.find((item) => item?.user === user?.userId)}
            style={{ width: "30%" }}
            hideControls
            leftSection={<IconCurrencyRupee size={18} />}
            size="xs"
            value={
              paidBy?.find((item) => item?.user === user?.userId)?.amount || 0
            }
            onChange={(e) => {
              let newArr = [...form.values.paidBy];
              let index = form.values.paidBy?.findIndex(
                (item) => item?.user === user?.userId
              );
              newArr[index].amount = Number(e);
              form.setFieldValue("paidBy", newArr);
            }}
          />
        )}
      </Group>
    </Paper>
  );
};

export default AddExpenseUser;
