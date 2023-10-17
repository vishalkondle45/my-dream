import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { theme } from "@/theme";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";

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
        <ConvexClientProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
