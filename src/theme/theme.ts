"use client"
import { colorsTuple, createTheme, DEFAULT_THEME, virtualColor } from "@mantine/core";

const theme = createTheme({
  colors: {
    white: colorsTuple('#fff'),
    black: colorsTuple('#000'),
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