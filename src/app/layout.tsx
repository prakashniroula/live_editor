import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import theme from "../theme/theme";

import LightDarkMode from "@/components/ui/LightDarkMode/LightDarkMode";
import "./globals.css";

const font = Poppins({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Code live",
  description: "Live code and collaboration tool with live preview, recordings, and AI support.",
};

/* DEV MODE ONLY */
// const testColorScheme = "light"
/* DEV MODE ONLY */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="w-full h-full" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={`antialiased h-full ${font.className}`}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
          <LightDarkMode />
        </MantineProvider>
      </body>
    </html>
  );
}
