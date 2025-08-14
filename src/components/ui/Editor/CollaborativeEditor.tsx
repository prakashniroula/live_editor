"use client";

import React from "react";
import styles from "./CollaborativeEditor.module.css";
import './globals.css';

// Collaborative code editor with undo/redo, live cursors, and live avatars
export function CollaborativeEditor({ref}:{ref: React.Ref<HTMLDivElement>}) {
  return (
    <div className={styles.container} ref={ref}></div>
  );
}