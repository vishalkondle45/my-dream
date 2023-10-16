import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { theme } from "@/theme";
import LandingPageNavbar from "@/components/navigation/LandingPageNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Dream",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme}>
          <LandingPageNavbar />
          <Container size="xl">{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
