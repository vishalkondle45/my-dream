"use client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Indicator,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  Textarea,
  Timeline,
} from "@mantine/core";
import { DatePicker, DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

const Page = () => {
  dayjs.extend(duration);
  const create = useMutation(api.events.create);
  const [date, setDate] = useState(new Date());
  // const events = useQuery(api.events.getEventsWithDate, {
  //   date: dayjs(date).format("MM-DD-YYYY"),
  // });
  const events = useQuery(api.events.getAll);
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  const handleSelect = (dt) =>
    setDate(dayjs(dt).isSame(date, "day") ? dayjs() : dayjs(dt));

  const checkDate = dayjs().isSame(date, "day");
  const checkHour = (e, i) =>
    dayjs(e.date + " " + e.time).format("H") === String(i);
  const checkDate2 = (e) =>
    dayjs(e.date).format("MM-DD-YYYY") === dayjs(date).format("MM-DD-YYYY");
  const selectedDateFormat = dayjs(date).format("DD MMM YYYY");

  const datePickerStyles = {
    month: { width: "100%" },
    day: { height: "10vh", width: "100%", borderRadius: "10%" },
    calendarHeader: { minWidth: "100%" },
    calendarHeaderLevel: { width: "100%" },
    levelsGroup: { justifyContent: "center" },
    yearsListCell: { width: "100%" },
  };

  const createEvent = async (start_time) => {
    form.setFieldValue(
      "date",
      dayjs(date).startOf("date").add(start_time, "h")
    );
    open();
  };

  const submitEvent = async () => {
    const values = { ...form.values };
    values.date = dayjs(form.values.date).format("MM-DD-YYYY HH:mm");
    create(values);
    close();
    form.reset();
  };

  if (!events) {
    return <LoadingOverlay />;
  }
  return (
    <Box>
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <DatePicker
            styles={datePickerStyles}
            getDayProps={(dt) => ({
              selected: dayjs(dt).isSame(date, "day"),
              onClick: () => handleSelect(dt),
            })}
            renderDay={(dt) => (
              <Indicator
                offset={-3}
                color="red"
                disabled={
                  !events.filter(
                    (d) => dayjs(dt).format("MM-DD-YYYY") === d.date
                  ).length
                }
                label={
                  events.filter(
                    (d) => dayjs(dt).format("MM-DD-YYYY") === d.date
                  ).length
                }
                processing
                size="xl"
              >
                <Text>{dt.getDate()}</Text>
              </Indicator>
            )}
            firstDayOfWeek={0}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Text fz={20} fw="bold" ta="center">
            {checkDate ? selectedDateFormat : "Today"}
          </Text>
          <Alert
            px={12}
            py={4}
            variant="filled"
            color="dark.4"
            title="Alert title"
            radius="xs"
          >
            <Text size="xs">All day</Text>
          </Alert>
          <Timeline
            mt={"xs"}
            active={dayjs().format("H")}
            bulletSize={24}
            lineWidth={2}
            mb={24}
          >
            {Array.from(Array(24).keys()).map((i) => (
              <Timeline.Item
                key={i}
                bullet={
                  <Avatar size={24} src={null} onClick={() => createEvent(i)}>
                    {String(i)}
                  </Avatar>
                }
                my={4}
              >
                <>
                  {events.filter((e) => checkHour(e, i) && checkDate2(e))
                    .length ? (
                    events
                      .filter((e) => checkHour(e, i) && checkDate2(e))
                      .map((event) => (
                        <Alert
                          px={12}
                          py={4}
                          my={4}
                          variant="filled"
                          color="dark.4"
                          title={event.title}
                          radius="xs"
                          key={event._id}
                        >
                          <Text size="sm">{event.description}</Text>
                          <Text ta="right" size="xs">
                            {event.time}
                          </Text>
                        </Alert>
                      ))
                  ) : (
                    <Text onClick={() => createEvent(i)}>&nbsp;</Text>
                  )}
                  <Divider />
                </>
              </Timeline.Item>
            ))}
          </Timeline>
        </Grid.Col>
      </Grid>

      <Modal opened={opened} onClose={close} title="Create event">
        <form onSubmit={form.onSubmit((values) => submitEvent(values))}>
          <TextInput
            label="Title"
            placeholder="Enter title"
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <DateTimePicker
            label="Date & Time"
            placeholder="Enter date and time"
            dropdownType="modal"
            {...form.getInputProps("date")}
          />
          <Group mt="xs" justify="center">
            <Button color="red" onClick={close} type="button">
              Cancel
            </Button>
            <Button color="green" type="submit">
              Create
            </Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

export default Page;
