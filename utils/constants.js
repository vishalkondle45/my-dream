import {
  IconCalendarEvent,
  IconCalendarTime,
  IconHome,
  IconSortAZ,
  IconStar,
  IconSun,
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

export const sidebarData = [
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
