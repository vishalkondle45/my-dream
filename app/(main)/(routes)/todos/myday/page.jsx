import { IconSun } from "@tabler/icons-react";
import StaticPage from "../../_components/StaticPage";

const Page = () => {
  return (
    <StaticPage
      sortBy="isImportant"
      reverse={false}
      field="isAddedToMyDay"
      value={true}
      hide="isAddedToMyDay"
      header="My Day"
      icon={<IconSun />}
    />
  );
};

export default Page;
