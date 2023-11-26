import { Group, NumberFormatter, Text } from "@mantine/core";
import React from "react";

const SummarySingleItem = ({ title, value, color, fw, ...others }) => {
  return (
    <Group justify="space-between" {...others}>
      <Text fw={fw}>{title}</Text>
      <Text c={color}>
        <NumberFormatter
          prefix="₹ "
          value={value}
          thousandsGroupStyle="lakh"
          thousandSeparator
          allowNegative={false}
        />
      </Text>
    </Group>
  );
};

export default SummarySingleItem;
