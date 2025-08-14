"use client";

import { Box } from "@mantine/core";
import { useState, useRef, PropsWithChildren } from "react";

interface ResizablePanelProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  height?: string | number;
}

export function ResizablePanel({
  initialWidth = 300,
  minWidth = 150,
  maxWidth = 800,
  height = "100%",
  children,
}: PropsWithChildren<ResizablePanelProps>) {
  const [width, setWidth] = useState(initialWidth);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const draggingRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;
    let newWidth = startWidthRef.current + (e.clientX - startXRef.current);
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    setWidth(newWidth);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  return (
    <Box style={{ display: "flex", height }}>
      <Box style={{ width, position: "relative" }}>
        {children}
        <Box
          onPointerDown={onPointerDown}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: 4,
            cursor: "col-resize",
          }}
        />
      </Box>
      <Box style={{ flex: 1 }} />
    </Box>
  );
}
