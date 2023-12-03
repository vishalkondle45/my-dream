"use client";
import { Alert, Box, Grid, Indicator, Text, Timeline } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

const Page = () => {
  const form = useForm({
    initialValues: {
      date: new Date(),
      title: "",
      description: "",
      user: "",
    },
  });

  const handleSelect = (date) =>
    form.setFieldValue(
      "date",
      dayjs(date).isSame(form.values.date, "date")
        ? dayjs().format("MM-DD-YYYY")
        : dayjs(date).format("MM-DD-YYYY")
    );

  const checkDate =
    dayjs(form.values.date).format("DDMMYYYY") !== dayjs().format("DDMMYYYY");
  const selectedDateFormat = dayjs(form.values.date).format("DD MMM YYYY");

  const datePickerStyles = {
    month: { width: "100%" },
    day: { height: "10vh", width: "100%", borderRadius: "10%" },
    calendarHeader: { minWidth: "100%" },
    calendarHeaderLevel: { width: "100%" },
    levelsGroup: { justifyContent: "center" },
    yearsListCell: { width: "100%" },
  };

  return (
    <Box>
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <DatePicker
            styles={datePickerStyles}
            getDayProps={(date) => ({
              selected: dayjs(date).isSame(form.values.date, "date"),
              onClick: () => handleSelect(date),
            })}
            renderDay={(date) => (
              <Indicator
                offset={-3}
                color="red"
                disabled={!dayjs(date).isSame(form.values.date, "date")}
                label={10}
                processing
                size="xl"
              >
                <Text>{date.getDate()}</Text>
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
              <Timeline.Item bullet={String(i)} my={0}>
                <>
                  {i % 3 === 0 ? (
                    <Alert
                      px={12}
                      py={4}
                      variant="filled"
                      color="dark.4"
                      title="Alert title"
                      radius="xs"
                    >
                      <Text size="xs">{`${i}:00 : ${i + 1}:00`}</Text>
                    </Alert>
                  ) : (
                    <Text>&emsp;</Text>
                  )}
                </>
              </Timeline.Item>
            ))}
          </Timeline>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Page;
