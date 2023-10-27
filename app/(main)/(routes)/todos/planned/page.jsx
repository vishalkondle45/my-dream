import { IconCalendarEvent } from "@tabler/icons-react";
import StaticPage from "../../_components/StaticPage";

const Page = () => {
  return (
    <StaticPage
      sortBy="isImportant"
      reverse={false}
      field="date"
      value=""
      hide=""
      not={true}
      header="Planned"
      icon={<IconCalendarEvent />}
    />
  );
};

export default Page;
