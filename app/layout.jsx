import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { theme } from "@/theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
// import "@mantine/modals/styles.css";
import "@mantine/carousel/styles.css";
import { Inter } from "next/font/google";
import LogUser from "./(main)/(routes)/_components/LogUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EaseLife",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <ConvexClientProvider>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications />
              <LogUser />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
