import { IconHome } from "@tabler/icons-react";
import StaticPage from "../_components/StaticPage";

const Page = () => {
  return (
    <StaticPage
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
