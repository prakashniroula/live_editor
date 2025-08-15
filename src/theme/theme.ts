"use client"
import { colorsTuple, createTheme, DEFAULT_THEME, virtualColor } from "@mantine/core";

const theme = createTheme({
  colors: {
    white: colorsTuple('#fff'),
    black: colorsTuple('#000'),
    dark: [
      "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280",
      "#4b5563", "#374151", "#1f2937", "#111827", "#030712", "#020617"
    ],
    darkGray: colorsTuple(DEFAULT_THEME.colors.gray[6]),
    text: virtualColor({
      name: 'text',
      dark: 'gray',
      light: 'dark',
    }),
    'subtle-gray': virtualColor({
      name: 'subtle-gray',
      dark: 'darkGray',
      light: 'gray'
    })
  }
});

export default theme;