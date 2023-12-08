"use client";
import weatherIcons from "@/utils/weather-icons";
import {
  Container,
  Group,
  Image,
  Paper,
  Select,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  useDebouncedState,
  useDebouncedValue,
  useMediaQuery,
} from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconPinned,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const Page = () => {
  const [cities, setCities] = useState([]);
  const [value, setValue] = useDebouncedState("", 500);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [debounced] = useDebouncedValue(value, 200);

  const getCities = async (city) => {
    const res = await axios
      .get(
        `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?q=${city}&apikey=Q5r5wrKVWYEzwGiBsvYGzRbAUZqM8oeF`
      )
      .catch((error) => {
        notifications.show({
          title: error.message,
          message: error.stack,
          color: "red",
          icon: <IconX />,
        });
      });
    if (res?.data?.length) {
      setCities(res?.data);
    }
  };

  useEffect(() => {
    const getWeather = async (city) => {
      const res = await axios
        .get(
          `http://dataservice.accuweather.com/currentconditions/v1/${city}?apikey=Q5r5wrKVWYEzwGiBsvYGzRbAUZqM8oeF&details=true`
        )
        .catch((error) => {
          notifications.show({
            title: error.message,
            message: error.stack,
            color: "red",
            icon: <IconX />,
          });
        });
      if (res?.data?.length) {
        setWeather(res?.data[0]);
        setLoading(false);
      } else {
        setWeather(null);
        setLoading(true);
      }
    };
    const getForecasts = async (city) => {
      const res = await axios
        .get(
          `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${city}?apikey=Q5r5wrKVWYEzwGiBsvYGzRbAUZqM8oeF&details=true&metric=true`
        )
        .catch((error) => {
          notifications.show({
            title: error.message,
            message: error.stack,
            color: "red",
            icon: <IconX />,
          });
        });
      if (res?.data) {
        setForecast(res?.data);
        setLoading(false);
      } else {
        setForecast(null);
        setLoading(true);
      }
    };
    if (debounced) {
      getWeather(debounced);
      getForecasts(debounced);
    } else {
      notifications.show({
        title: "Please select the city",
        color: "red",
        icon: <IconPinned />,
      });
    }
  }, [debounced]);
  return (
    <Container size="xs">
      <Paper px="xs" py="xl">
        <Select
          searchable
          onSearchChange={(value) => getCities(value)}
          data={cities?.map((item) => ({
            label: `${item?.LocalizedName}, ${item?.AdministrativeArea?.LocalizedName} - ${item?.Country?.LocalizedName}`,
            value: item?.Key,
          }))}
          onChange={(value) => setValue(value)}
        />
        <Paper my="lg" p="xs" shadow="xl" withBorder>
          <Group justify="space-evenly">
            <Skeleton visible={loading} width="50%">
              <Image
                src={
                  weatherIcons.find(({ id }) => id === weather?.WeatherIcon)
                    ?.url
                }
                h={isMobile ? 100 : 155}
              />
            </Skeleton>
            <Stack gap={isMobile ? 0 : "xs"}>
              <Skeleton visible={loading}>
                <Text>
                  {dayjs(weather?.LocalObservationDateTime).format(
                    "DD-MMM-YYYY"
                  )}
                </Text>
              </Skeleton>
              <Skeleton visible={loading}>
                <Title order={3}>{weather?.Temperature?.Metric.Value}° C</Title>
              </Skeleton>
              <Skeleton visible={loading}>
                <Text fw={700}>
                  {cities.find((item) => item.Key === debounced)?.LocalizedName}
                </Text>
              </Skeleton>
              <Skeleton visible={loading}>
                <Text fw={400}>{weather?.WeatherText}</Text>
              </Skeleton>
            </Stack>
          </Group>
        </Paper>
        <Group justify={isMobile ? "center" : "space-between"}>
          {forecast?.DailyForecasts.map((item) => (
            <Paper
              w={isMobile && "100%"}
              p="md"
              shadow="xl"
              withBorder
              key={item?.Date}
            >
              <Text style={{ whiteSpace: "nowrap" }} fw={700} ta="center">
                {dayjs(item?.Date).format("DD-MMM-YYYY")}
              </Text>
              <Group wrap="nowrap" justify="space-between">
                <Group align="center" gap={0}>
                  <ThemeIcon size="sm" variant="transparent" color="green">
                    <IconCaretUpFilled />
                  </ThemeIcon>
                  <Text size="xs">{item.Temperature.Maximum.Value}° C</Text>
                </Group>
                <Group align="center" gap={0}>
                  <ThemeIcon size="sm" variant="transparent" color="red">
                    <IconCaretDownFilled />
                  </ThemeIcon>
                  <Text size="xs">{item.Temperature.Minimum.Value}° C</Text>
                </Group>
              </Group>
              <Group wrap="nowrap" mt="sm" justify="space-between">
                <Stack gap={0} align="center">
                  <Text size="sm" fw={500}>
                    Day
                  </Text>
                  <Image
                    h={50}
                    w="auto"
                    src={
                      weatherIcons.find(({ id }) => id === item?.Day?.Icon)?.url
                    }
                  />
                  <Text size="xs" truncate="end">
                    {item?.Day?.IconPhrase}
                  </Text>
                </Stack>
                <Stack gap={0} align="center">
                  <Text size="sm" fw={500}>
                    Night
                  </Text>
                  <Image
                    h={50}
                    w="auto"
                    src={
                      weatherIcons.find(({ id }) => id === item?.Night?.Icon)
                        ?.url
                    }
                  />
                  <Text size="xs" truncate="end">
                    {item?.Night?.IconPhrase}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          ))}
          {/* <Forecast
            item={weather?.TemperatureSummary["Past6HourRange"]}
            title="Past 6 Hours"
          />
          <Forecast
            item={weather?.TemperatureSummary["Past12HourRange"]}
            title="Past 12 Hours"
          />
          <Forecast
            item={weather?.TemperatureSummary["Past24HourRange"]}
            title="Past 24 Hours"
          /> */}
        </Group>
      </Paper>
    </Container>
  );
};

export default Page;
