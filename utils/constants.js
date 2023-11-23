import { Box, Center } from "@mantine/core";
import {
  IconBuilding,
  IconCalendarEvent,
  IconCalendarTime,
  IconCar,
  IconCricket,
  IconDots,
  IconHome,
  IconNote,
  IconSortAZ,
  IconStar,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";

export const sortMap = [
  {
    value: "isImportant",
    label: "Imporatance",
    icon: <IconStar size={16} />,
  },
  {
    value: "date",
    label: "Due date",
    icon: <IconCalendarEvent size={16} />,
  },
  {
    value: "todo",
    label: "Alphabetically",
    icon: <IconSortAZ size={16} />,
  },
  {
    value: "_creationTime",
    label: "Creation Time",
    icon: <IconCalendarTime size={16} />,
  },
];

export const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "indigo",
  "violet",
  "pink",
  "teal",
  "cyan",
  "lime",
  "orange",
];

export const sidebarDataTodos = [
  {
    icon: <IconHome size={18} />,
    text: "Todos",
    route: "/todos",
  },
  {
    icon: <IconSun size={18} />,
    text: "My Day",
    route: "/todos/myday",
  },
  {
    icon: <IconStar size={18} />,
    text: "Important",
    route: "/todos/important",
  },
  {
    icon: <IconCalendarEvent size={18} />,
    text: "Planned",
    route: "/todos/planned",
  },
];

export const sidebarDataNotes = [
  {
    icon: <IconNote size={18} />,
    text: "Notes",
    route: "/notes",
  },
  {
    icon: <IconTrash size={18} />,
    text: "Trash",
    route: "/notes/trash",
  },
];

export const sidebarDataSplit = [
  {
    icon: <IconHome size={18} />,
    text: "Home",
    route: "/split",
  },
];

export const splitGroupTypes = [
  {
    value: "home",
    label: (
      <Center>
        <IconHome size={16} />
        <Box ml={4}>Home</Box>
      </Center>
    ),
  },
  {
    value: "trip",
    label: (
      <Center>
        <IconCar size={16} />
        <Box ml={4}>Trip</Box>
      </Center>
    ),
  },
  {
    value: "office",
    label: (
      <Center>
        <IconBuilding size={16} />
        <Box ml={4}>Office</Box>
      </Center>
    ),
  },
  {
    value: "sports",
    label: (
      <Center>
        <IconCricket size={16} />
        <Box ml={4}>Sports</Box>
      </Center>
    ),
  },
  {
    value: "others",
    label: (
      <Center>
        <IconDots size={16} />
        <Box ml={4}>Others</Box>
      </Center>
    ),
  },
];

export const getGroupIconByType = (type) => {
  switch (type) {
    case "home":
      return <IconHome />;

    case "trip":
      return <IconCar />;

    case "office":
      return <IconBuilding />;

    case "sports":
      return <IconCricket />;

    default:
      return <IconDots />;
  }
};

export const getGroups = [
  { name: "Home", icon: <IconHome /> },
  { name: "Trip", icon: <IconCar /> },
  { name: "Office", icon: <IconBuilding /> },
  { name: "Sports", icon: <IconCricket /> },
  { name: "Others", icon: <IconDots /> },
];
