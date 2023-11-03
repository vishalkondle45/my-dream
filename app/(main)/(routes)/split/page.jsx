import { IconHome } from "@tabler/icons-react";
import TodoStaticPage from "../_components/TodoStaticPage";

const Page = () => {
  return (
    <TodoStaticPage
      sortBy="isImportant"
      reverse={false}
      field="list"
      value=""
      hide="list"
      header="Todos"
      icon={<IconHome />}
    />
  );
};

export default Page;
