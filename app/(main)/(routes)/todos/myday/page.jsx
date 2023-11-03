import { IconSun } from "@tabler/icons-react";
import TodoStaticPage from "../../_components/TodoStaticPage";

const Page = () => {
  return (
    <TodoStaticPage
      sortBy="isImportant"
      reverse={false}
      field="isAddedToMyDay"
      value={true}
      hide="isAddedToMyDay"
      header="My Day"
      icon={<IconSun />}
      object={{ isAddedToMyDay: true }}
    />
  );
};

export default Page;
