"use client";
import { OpaqueRoom } from '@liveblocks/core';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRef } from 'react';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Awareness } from 'y-protocols/awareness';
import * as Y from 'yjs';

const YDOC_NAME = "live_editor_files"

function useLiveCollab({ room, options = {} }: {room: OpaqueRoom, options?: object}) {
  const ydocRef = useRef<Y.Doc|null>(null);
  const awarenessRef = useRef<Awareness|null>(null);
  const undoManagersRef = useRef<Map<string, Y.UndoManager>>(new Map());

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
    new IndexeddbPersistence(YDOC_NAME, ydocRef.current);
    const onlineProvider = new LiveblocksYjsProvider(room, ydocRef.current, options)
    /// @ts-expect-error clientID doesnt exist in liveblocks
    awarenessRef.current = onlineProvider.awareness;
  }

  const ydoc = ydocRef.current!;
  const awareness = awarenessRef.current!;

  const getFileText = (fileId: string) => {
    const filesMap = ydoc.getMap<Y.Text>(YDOC_NAME);
    let ytext = filesMap.get(fileId);
    if (!ytext) {
      ytext = new Y.Text();
      filesMap.set(fileId, ytext);
    }
    
    return ytext;
  };

  const getUndoManager = (fileId: string) => {
    if (!undoManagersRef.current.has(fileId)) {
      undoManagersRef.current.set(fileId, new Y.UndoManager(getFileText(fileId)));
    }
    return undoManagersRef.current.get(fileId)!;
  };

  const setLocalUser = (user: { name?: string; color?: string, colorLight?: string }) => {
    awareness.setLocalStateField("user", user);
  };

  const setActiveFile = (fileId: string) => {
    awareness.setLocalStateField("currentFile", fileId);
  };

  const deleteFile = (fileId: string) => {
    ydoc.transact(() => {
      const filesMap = ydoc.getMap<Y.Text>(YDOC_NAME);
      filesMap.delete(fileId);
      undoManagersRef.current.get(fileId)?.destroy();
      undoManagersRef.current.delete(fileId);
      const localState = awareness.getLocalState()
      if ( localState === null) return;
      if ( localState["currentFile"] == fileId ) {
        awareness.setLocalStateField("currentFile", '');
      }
    })
  }

  return { ydoc, awareness, getFileText, getUndoManager, setLocalUser, setActiveFile, deleteFile};
}

export default useLiveCollab