"use client";

import { Loader, createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Inter, Verdana, sans-serif",
  headings: { fontFamily: "Inter, Verdana, sans-serif" },
  primaryColor: "dark",
  defaultRadius: "xl",
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: "dots",
      },
    }),
  },
});
