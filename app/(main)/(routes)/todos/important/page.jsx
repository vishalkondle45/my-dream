import { IconStar } from "@tabler/icons-react";
import StaticPage from "../../_components/StaticPage";

const Page = () => {
  return (
    <StaticPage
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
