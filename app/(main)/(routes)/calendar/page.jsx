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
      time: "00:00",
    },
    validate: {
      title: (value) => (value.length ? null : "This field is required."),
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

  const createEvent = async (hour) => {
    console.log(dayjs(date).startOf("date").add(hour, "hours"));
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
            {checkDate ? "Today" : selectedDateFormat}
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
                    <>
                      {events
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

      <Modal opened={opened} onClose={close} title="Create event">
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
