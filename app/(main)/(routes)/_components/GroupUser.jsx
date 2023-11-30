import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useHover } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { colors } from "../../../../utils/constants";
import { getInitials, sumAscii } from "../../../../utils/functions";

const GroupUser = ({ user, splitAmong, paidBy }) => {
  const { hovered, ref } = useHover();
  const removeUserFromGroup = useMutation(api.groups.removeUserFromGroup);
  const openModal = () => {
    if (getSpendings(user.userId) !== 0) {
      showNotification({
        color: "red",
        icon: <IconX />,
        message: `You cant remove users with settlement pending`,
      });
      return null;
    }
    modals.openConfirmModal({
      title: "Remove Member",
      children: <Text size="sm">Press confirm to remove this member.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => removeUserFromGroup({ user: user?._id }),
      size: "xs",
    });
  };

  const getSpendings = (userId) =>
    paidBy
      ?.filter((item) => item.user === userId)
      ?.reduce((n, { amount }) => n + amount, 0);

  const getShare = (userId) =>
    splitAmong
      ?.filter((item) => item.user === userId)
      ?.reduce((n, { amount }) => n + amount, 0);

  const getBalance = (userId) =>
    getSpendings(userId) + 0 - (getShare(userId) + 0);

  return (
    <Box key={user?._id} ref={ref}>
      <Group py="sm" justify="space-between">
        <Group gap="xs">
          <Avatar
            size="sm"
            color={colors[sumAscii(user?.name) - 1]}
            radius="xl"
          >
            {getInitials(user?.name)}
          </Avatar>
          <Text fz="sm">{user?.name}</Text>
        </Group>
        <Group>
          <Text fz="sm" c={getBalance(user.userId) > 0 ? "green" : "red"}>
            <NumberFormatter
              prefix="₹ "
              value={getBalance(user.userId)}
              thousandsGroupStyle="lakh"
              thousandSeparator
              allowNegative={false}
            />
          </Text>
          {hovered && (
            <ActionIcon
              variant="transparent"
              color="red"
              style={{ cursor: "pointer" }}
              onClick={openModal}
              title="Remove user"
            >
              <IconX />
            </ActionIcon>
          )}
        </Group>
      </Group>
      <Divider variant="dashed" />
    </Box>
  );
};

export default GroupUser;
