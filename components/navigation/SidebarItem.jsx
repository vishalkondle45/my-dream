import { Button } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

const SidebarItem = ({ text, icon, route }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      justify="left"
      variant={pathname === route ? "filled" : "subtle"}
      leftSection={icon}
      onClick={() => router.push(route)}
      radius="xl"
    >
      {text}
    </Button>
  );
};

export default SidebarItem;
