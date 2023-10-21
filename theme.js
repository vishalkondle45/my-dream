"use client";

import { createTheme, TextInput } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Inter, Verdana, sans-serif",
  headings: { fontFamily: "Inter, Verdana, sans-serif" },
  primaryColor: "dark",
  primaryShade: {
    dark: 9,
    light: 5,
  },
  components: {
    TextInput: TextInput.extend({
      defaultProps: {
        color: "white",
      },
    }),
  },
});
