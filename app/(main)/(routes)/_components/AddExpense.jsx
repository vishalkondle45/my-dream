import { api } from "@/convex/_generated/api";
import {
  Box,
  Button,
  Center,
  Group,
  NumberInput,
  Paper,
  Popover,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendar,
  IconChevronDown,
  IconCurrencyRupee,
  IconEqual,
  IconNotes,
  IconUser,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AddExpenseUser from "../_components/AddExpenseUser";

const AddExpense = ({ group, user, users, close }) => {
  const [opened, setOpened] = useState(false);
  const add = useMutation(api.expense.add);

  const form = useForm({
    initialValues: {
      amount: 0,
      date: new Date(),
      paidBy: [{ user: user?.subject, amount: 0 }],
      description: "",
      payer: "single",
      splitAmong: [],
    },
    validate: {
      description: (value) => (value ? null : "Description is required."),
      date: (value) => (value ? null : "Description is required."),
      amount: (value) =>
        value && value > 0 ? null : "Amount must be greater than 0.",
      paidBy: (value, values) =>
        value?.reduce((n, { amount }) => n + amount, 0) === values.amount
          ? null
          : "Paid By amount in is not equal to the price of the bill",
      splitAmong: (value, values) =>
        value?.reduce((n, { amount }) => n + amount, 0) === values.amount
          ? null
          : "Split among amount in is not equal to the price of the bill",
    },
  });

  useEffect(() => {
    if (form.values.payer === "single") {
      form.setFieldValue("paidBy", [
        { user: user?.subject, amount: form.values.amount },
      ]);
    } else {
      form.setFieldValue(
        "paidBy",
        users?.map((item) => ({
          user: item.userId,
          amount: 0,
        }))
      );
    }
  }, [form.values.payer, form.values.amount]);

  useEffect(() => {
    form.setFieldValue("payer", "single");
    form.setFieldValue(
      "splitAmong",
      users?.map((item) => ({
        user: item.userId,
        amount: form.values?.amount / users?.length,
      }))
    );
  }, [form.values?.amount]);

  const addExpense = (values) => {
    add({
      ...values,
      group: group._id,
      date: dayjs(values.date).format("MM-DD-YYYY"),
      payer: undefined,
    });
    close();
    form.reset();
  };

  const multipleSelectUser = (user) => {
    form.setFieldValue(
      "paidBy",
      form.values.paidBy?.find((item) => item?.user === user?.userId)
        ? form.values.paidBy?.filter((item) => item?.user !== user?.userId)
        : [
            ...form.values.paidBy,
            {
              user: user?.userId,
              amount: 0,
            },
          ]
    );
  };

  const singleSelectUser = (user) => {
    form.setFieldValue("paidBy", [
      {
        user: user?.userId,
        amount: form.values?.amount,
      },
    ]);
  };

  const equalize = () =>
    form.setFieldValue(
      "splitAmong",
      form.values?.splitAmong?.map((item) => ({
        ...item,
        amount: form.values?.amount / users?.length,
      }))
    );

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) =>
          addExpense({ ...values, group: group._id })
        )}
      >
        <Group justify="space-between" gap={0} wrap="nowrap" align="flex-start">
          <TextInput
            placeholder="Add a description"
            label="Description"
            leftSection={<IconNotes size={18} />}
            {...form.getInputProps("description")}
            w="100%"
            mr="sm"
          />
          <DatePickerInput
            label="Date"
            leftSection={<IconCalendar size={18} />}
            {...form.getInputProps("date")}
            valueFormat=" DD MMM YYYY"
            style={{ whiteSpace: "nowrap" }}
          />
        </Group>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <NumberInput
            min={0}
            placeholder="Enter price"
            label="Price"
            {...form.getInputProps("amount")}
            leftSection={<IconCurrencyRupee size={18} />}
          />
          <Popover
            opened={opened}
            onChange={setOpened}
            width={350}
            trapFocus
            position="bottom"
            withArrow
            shadow="xl"
            arrowSize={12}
          >
            <Popover.Target>
              <TextInput
                label="Paid By"
                readOnly
                leftSection={<IconUserCircle size={18} />}
                rightSection={<IconChevronDown />}
                onClick={() => setOpened((o) => !o)}
                value={
                  form.values.payer === "single"
                    ? form.values.paidBy[0]?.user === user?.subject
                      ? "You"
                      : users?.find(
                          (u) => u.subject === form.values.paidBy[0]?.user
                        )?.name
                    : "Multiple"
                }
                error={form.errors.paidBy}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <SegmentedControl
                size="xs"
                radius="xl"
                mb="xs"
                fullWidth
                data={[
                  {
                    value: "single",
                    label: (
                      <Center>
                        <IconUser size={16} />
                        <Box ml={10}>Single Payer</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "multiple",
                    label: (
                      <Center>
                        <IconUsers size={16} />
                        <Box ml={10}>Multi Payer</Box>
                      </Center>
                    ),
                  },
                ]}
                {...form.getInputProps("payer")}
              />
              {form.values.payer === "single" ? (
                <>
                  <Stack gap="xs">
                    {users?.map((item) => (
                      <AddExpenseUser
                        paidBy={form.values.paidBy}
                        user={item}
                        currentUser={user}
                        key={item?._id}
                        selectUser={() => singleSelectUser(item)}
                      />
                    ))}
                  </Stack>
                </>
              ) : (
                <>
                  <Stack gap="xs">
                    {users?.map((item) => (
                      <AddExpenseUser
                        paidBy={form.values.paidBy}
                        user={item}
                        currentUser={user}
                        key={item?._id}
                        withAmount
                        form={form}
                        selectUser={() => multipleSelectUser(item)}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Popover.Dropdown>
          </Popover>
        </Group>
        <Box mt="xs">
          <Group justify="space-between" align="flex-start">
            <Text fw={500} fz="sm">
              Split Among
            </Text>
            <Button
              size="compact-xs"
              leftSection={<IconEqual size={16} />}
              onClick={equalize}
              radius="lg"
              variant="filled"
            >
              Equalize
            </Button>
          </Group>
          <Text c="red" fz="xs" lh={1.2}>
            {form.errors.splitAmong}
          </Text>
          <ScrollArea mt="xs" type="auto" offsetScrollbars>
            <Group justify="left" wrap="nowrap" align="flex-start">
              {users?.map((user) => (
                <Paper
                  withBorder
                  miw={rem(90)}
                  maw={rem(90)}
                  shadow="xl"
                  radius="lg"
                  p="xs"
                  key={user?._id}
                >
                  <Stack gap={0}>
                    <Text ta="center" size="xs">
                      {user?.name.slice(0, 10)}
                    </Text>
                    <NumberInput
                      prefix="₹"
                      size="xs"
                      min={0}
                      hideControls
                      value={
                        form?.values?.splitAmong?.find(
                          (item) => item?.user === user?.userId
                        )?.amount
                      }
                      onChange={(value) => {
                        let index = form.values.splitAmong?.findIndex(
                          (item) => item.user === user.userId
                        );
                        let newArr = [...form.values.splitAmong];
                        newArr[index].amount = value;
                        form.setFieldValue("splitAmong", newArr);
                      }}
                      radius="lg"
                    />
                  </Stack>
                </Paper>
              ))}
            </Group>
          </ScrollArea>
        </Box>
        <Button type="submit" mt="xs" variant="filled" fullWidth>
          Submit expense
        </Button>
      </form>
    </>
  );
};

export default AddExpense;
