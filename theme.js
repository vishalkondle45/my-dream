"use client";

import { Loader, createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Inter, Verdana, sans-serif",
  headings: { fontFamily: "Inter, Verdana, sans-serif" },
  primaryColor: "dark",
  // primaryShade: {
  //   dark: 9,
  //   light: 7,
  // },
  defaultRadius: "xl",
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: "dots",
      },
    }),
  },
});
