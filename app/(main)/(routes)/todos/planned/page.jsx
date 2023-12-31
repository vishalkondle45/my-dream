import { IconCalendarEvent } from "@tabler/icons-react";
import TodoStaticPage from "../../_components/TodoStaticPage";
import dayjs from "dayjs";

const Page = () => {
  return (
    <TodoStaticPage
      sortBy="isImportant"
      reverse={false}
      field="date"
      value=""
      hide=""
      not={true}
      header="Planned"
      icon={<IconCalendarEvent />}
      object={{ date: dayjs().format("MM-DD-YYYY"), isAddedToMyDay: true }}
    />
  );
};

export default Page;
