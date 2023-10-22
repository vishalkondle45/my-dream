import { Box, Container } from "@mantine/core";
import "@mantine/core/styles.css";
import LandingPageNavbar from "@/app/(marketing)/_components/Navbar";

export const metadata = {
  title: "My Dream",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  return (
    <Box>
      <LandingPageNavbar />
      <Box px="lg">{children}</Box>
    </Box>
  );
}
