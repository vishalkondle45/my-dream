import { sortMap } from "@/utils/constants";
import { ActionIcon, Group, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import React from "react";

const Sorting = ({ setSort, sort }) => {
  return (
    <div>
      <Group my="xs" gap={8} justify="right">
        <ActionIcon
          title="Reverse sort order"
          onClick={() =>
            setSort((sort) => ({ ...sort, reverse: !sort.reverse }))
          }
          size="xs"
          variant="subtle"
        >
          {sort.reverse ? <IconChevronDown /> : <IconChevronUp />}
        </ActionIcon>
        <Text size="xs">
          Sorted by {sortMap.find((item) => item.value === sort.sortBy).label}
        </Text>
      </Group>
    </div>
  );
};

export default Sorting;
