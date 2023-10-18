import { Container } from "@mantine/core";
import "@mantine/core/styles.css";
import LandingPageNavbar from "@/app/(marketing)/_components/Navbar";

export const metadata = {
  title: "My Dream",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  return (
    <Container size="xl">
      <LandingPageNavbar />
      {children}
    </Container>
  );
}
