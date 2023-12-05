"use client";
import { api } from "@/convex/_generated/api";
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
import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";

const Page = () => {
  dayjs.extend(duration);
  const create = useMutation(api.events.create);
  const [date, setDate] = useState(new Date());
  const update = useMutation(api.events.update);
  const events = useQuery(api.events.getAll);
  const [opened, { open, close }] = useDisclosure(false);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "00:00",
    },
    validate: {
      title: (value) => (value.length ? null : "This field is required."),
    },
  });
  const form1 = useForm({
    initialValues: {
      _id: "",
      title: "",
      description: "",
      date: "",
      time: "00:00",
    },
    validate: {
      title: (value) => (value.length > 0 ? null : "This field is required."),
    },
  });

  const openEdit = async (event) => {
    let eventDetails = { ...event };
    let [hours, minutes] = eventDetails.time.split(":");
    eventDetails.date = dayjs(eventDetails.date)
      .add(hours, "hours")
      .add(minutes, "minutes");
    eventDetails._creationTime = undefined;
    eventDetails.user = undefined;
    form1.setValues(eventDetails);
    open1();
  };

  const handleSelect = (dt) =>
    setDate(dayjs(dt).isSame(date, "day") ? dayjs() : dayjs(dt));

  const checkDate = dayjs().isSame(date, "day");
  const isAfter = dayjs().isAfter(date);
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

  const createEvent = async (hour) => {
    form.setValues({
      date,
      time: dayjs(date).startOf("date").add(hour, "hours").format("HH:mm"),
    });
    open();
  };

  const submitEvent = async () => {
    create({
      ...form.values,
      date: dayjs(form.values.date).format("MM-DD-YYYY"),
    });
    close();
    form.reset();
  };

  const submitUpdate = async () => {
    update({
      ...form1.values,
      date: dayjs(form1.values.date).format("MM-DD-YYYY"),
    });
    close1();
    form1.reset();
  };

  const closeNew = () => {
    close();
    form.reset();
  };

  const closeEdit = () => {
    close1();
    form1.reset();
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
                <Text fw={dayjs().isSame(dt, "day") && "bold"}>
                  {dt.getDate() + (dayjs().isSame(dt, "day") && " (Today)")}
                </Text>
              </Indicator>
            )}
            firstDayOfWeek={0}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Text fz={20} fw="bold" ta="center">
            {checkDate ? "Today" : selectedDateFormat}
          </Text>
          {/* <Alert
            px={12}
            py={4}
            variant="filled"
            color="dark.4"
            title="Alert title"
            radius="xs"
          >
            <Text size="xs">All day</Text>
          </Alert> */}
          <Timeline
            mt={"xs"}
            active={checkDate ? dayjs().format("H") : isAfter ? "24" : "-1"}
            bulletSize={24}
            lineWidth={2}
            mb={24}
          >
            {Array.from(Array(24).keys()).map((i) => (
              <Timeline.Item
                key={i}
                bullet={
                  <Avatar size={26} src={null} onClick={() => createEvent(i)}>
                    {String(i)}
                  </Avatar>
                }
                my={4}
              >
                <>
                  {events.filter((e) => checkHour(e, i) && checkDate2(e))
                    .length ? (
                    <>
                      {events
                        .filter((e) => checkHour(e, i) && checkDate2(e))
                        .map((event) => (
                          <Alert
                            onClick={() => openEdit(event)}
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
                        ))}
                      <Text size="xs" onClick={() => createEvent(i)}>
                        &nbsp;
                      </Text>
                    </>
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

      <Modal opened={opened} onClose={closeNew} title="Create event">
        <form onSubmit={form.onSubmit((values) => submitEvent(values))}>
          <TextInput
            label="Title"
            placeholder="Enter title"
            {...form.getInputProps("title")}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <Group grow>
            <DateInput
              label="Date"
              placeholder="Date"
              {...form.getInputProps("date")}
              valueFormat="DD MMM YYYY"
              disabled
            />
            <TimeInput
              label="Time"
              placeholder="Time"
              {...form.getInputProps("time")}
            />
          </Group>
          <Group mt="xs" justify="center">
            <Button color="red" onClick={closeNew} type="button">
              Cancel
            </Button>
            <Button color="green" type="submit">
              Create
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={opened1} onClose={closeEdit} title="Edit event">
        <form onSubmit={form1.onSubmit((values) => submitUpdate(values))}>
          <TextInput
            label="Title"
            placeholder="Enter title"
            {...form1.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...form1.getInputProps("description")}
          />
          <Group grow>
            <DateInput
              label="Date"
              placeholder="Date"
              {...form1.getInputProps("date")}
              valueFormat="DD MMM YYYY"
              disabled
            />
            <TimeInput
              label="Time"
              placeholder="Time"
              {...form1.getInputProps("time")}
            />
          </Group>
          <Group mt="xs" justify="center">
            <Button color="red" onClick={closeEdit} type="button">
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
