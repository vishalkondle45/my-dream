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
import { modals } from "@mantine/modals";
import { useMutation } from "convex/react";
import { getInitials, sumAscii } from "../../../../utils/functions";
import { colors } from "../../../../utils/constants";
import { useHover } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

const GroupUser = ({ user }) => {
  const { hovered, ref } = useHover();
  const removeUserFromGroup = useMutation(api.groups.removeUserFromGroup);
  const openModal = () =>
    modals.openConfirmModal({
      title: "Remove Member",
      children: <Text size="sm">Press confirm to remove this member.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => removeUserFromGroup({ user: user?._id }),
      size: "xs",
    });

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
          <Text fz="sm" c={100000 > 0 ? "green" : "red"}>
            <NumberFormatter
              prefix="₹ "
              value={100000}
              thousandsGroupStyle="lakh"
              thousandSeparator
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
