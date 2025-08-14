"use client"
import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

export default function useColorScheme() {
  const colScheme = useMantineColorScheme();

  useEffect(() => {
    if (colScheme.colorScheme === "auto") {
      colScheme.setColorScheme("light");
    }
  }, [colScheme]);

  return colScheme
}