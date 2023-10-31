import { Paper, Text, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/navigation";

const NavItem = ({ icon, text, color, setOpened }) => {
  const router = useRouter();
  return (
    <Paper
      style={{ cursor: "pointer" }}
      onClick={() => {
        setOpened(false);
        router.push("/" + text?.toLowerCase());
      }}
      p="xs"
      ta="center"
      bg="transparent"
    >
      <ThemeIcon variant="transparent" color={color}>
        {icon}
      </ThemeIcon>
      <Text c={color}>{text}</Text>
    </Paper>
  );
};

export default NavItem;
