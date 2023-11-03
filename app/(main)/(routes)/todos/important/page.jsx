import { IconStar } from "@tabler/icons-react";
import TodoStaticPage from "../../_components/TodoStaticPage";

const Page = () => {
  return (
    <TodoStaticPage
      sortBy="isImportant"
      reverse={false}
      field="isImportant"
      value={true}
      hide=""
      header="Important"
      icon={<IconStar />}
      object={{ isImportant: true }}
    />
  );
};

export default Page;
