import { Button } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

const TodoSidebarItem = ({ text, icon, route }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      justify="left"
      variant={pathname === route ? "filled" : "subtle"}
      leftSection={icon}
      onClick={() => router.push(route)}
      radius="xl"
      styles={{
        label: { textOverflow: "ellipsis" },
      }}
    >
      {text}
    </Button>
  );
};

export default TodoSidebarItem;
