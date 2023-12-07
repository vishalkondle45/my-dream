import {
  Blockquote,
  Container,
  Notification,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import {
  IconBlockquote,
  IconCalendar,
  IconCircleCheck,
  IconCloudRain,
  IconCoinRupee,
  IconFileText,
  IconMessageCircle2,
  IconMusic,
  IconNote,
} from "@tabler/icons-react";
import classes from "./FeaturesGrid.module.css";

export const MOCKDATA = [
  {
    icon: IconNote,
    title: "Notes",
    description:
      "The Ultimate Note-Taking Companion! Capture ideas, thoughts, and inspirations seamlessly. Organize your life with ease, as NoteFlow effortlessly adapts to your unique style.",
  },
  {
    icon: IconCircleCheck,
    title: "Todo",
    description:
      "Your Personal Task Manager for Effortless Productivity! Tackle your to-dos with precision and ease. Prioritize, organize, and conquer your day, all in one place.",
  },
  {
    icon: IconCoinRupee,
    title: "Split",
    description:
      "The Ultimate Money Splitting App! Whether it's splitting bills, sharing expenses, or managing group finances, SplitEase simplifies the process.",
  },
  {
    icon: IconCalendar,
    title: "Calendar",
    description:
      "Your Navigational Hub for Efficient Living! Seamlessly manage your schedule, appointments, and events with TimeHarbor. Organize your life effortlessly, stay ahead of deadlines, and never miss a moment.",
  },
  {
    icon: IconCloudRain,
    title: "Weather",
    description:
      "Your Ultimate Weather Companion! Whether rain or shine, be in control of your day with real-time weather updates, personalized forecasts, and intuitive insights. ",
  },
  {
    icon: IconMusic,
    title: "Music",
    description:
      "Your Gateway to Musical Bliss! Elevate your listening experience as HarmonyHub delivers a symphony of personalized music at your fingertips.",
  },
  {
    icon: IconFileText,
    title: "Blog",
    description:
      "Where Ideas Take Flight! Dive into a realm of thought-provoking content and captivating narratives. Explore the latest trends, gain valuable insights, and embark on a journey of knowledge with our curated blog.",
  },
  {
    icon: IconMessageCircle2,
    title: "Forum",
    description:
      "Your Gateway to Enlightening Discussions! Engage in vibrant conversations, share your expertise, and connect with like-minded individuals. ",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Paper withBorder p="md" shadow="xl">
      <ThemeIcon variant="filled" size={40} radius={40}>
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </Paper>
  );
}

export default function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>Introducing 'EaseLife'</Title>
      <Blockquote
        color="blue"
        cite="– where simplicity
          meets innovation."
        icon={<IconBlockquote />}
        mt="xl"
      >
        Your Ultimate Life Simplification App! Revolutionize your daily routine
        with a single tap. Streamline tasks, manage priorities effortlessly, and
        unlock a world of convenience. Say goodbye to stress and embrace the
        simplicity of life with EaseLife
      </Blockquote>
      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: "xl", md: 50 }}
        verticalSpacing={{ base: "xl", md: 50 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
