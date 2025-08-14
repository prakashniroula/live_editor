"use client";
import languageSupport from '@/utils/languageSupport';
import { oneDark as themeDark } from '@codemirror/theme-one-dark';
import { useRoom, useSelf } from '@liveblocks/react';
import { githubLight as themeLight } from '@uiw/codemirror-theme-github';
import { basicSetup, EditorState, EditorView, Extension, StateEffect } from '@uiw/react-codemirror';
import { useCallback, useEffect, useRef, useState } from 'react';
import { yCollab } from 'y-codemirror.next';
import { UndoManager as YUndoManager } from 'yjs';
import useColorScheme from './useColorScheme';
import useLiveCollab from './useLiveCollab';

export function useLiveCollabInit(activeFileId: string) {

  const [element, setElement] = useState<HTMLElement>();

  const returnRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const room = useRoom();
  
  const colScheme = useColorScheme();

  /// @ts-expect-error weird error
  const userInfo = useSelf<{name: string, color: string, colorLight: string}>((me) => me.info);

  const viewRef = useRef<EditorView|null>(null);
  const extensionsRef = useRef<Extension[]>([]);
  
  const activeLineTheme = () => EditorView.theme({
    '.cm-activeLine': {
      backgroundColor: colScheme.colorScheme === 'dark' ? '#B9D2FF10 !important': '#cceeffaa !important'
    }
  })
  
  const { ydoc, awareness, getFileText, getUndoManager, setLocalUser, setActiveFile, deleteFile } = useLiveCollab({room: room});


  const undoManagerRef = useRef<YUndoManager>(null);

  // Set up Liveblocks Yjs provider and attach CodeMirror editor
  //  [ RUNS : ONCE ]
  useEffect(() => {
    if (!element || !room || !userInfo) {
      return;
    }

    setActiveFile(activeFileId);
    const ytext = getFileText(activeFileId);
    const undoManager = getUndoManager(activeFileId);
    undoManagerRef.current = undoManager;
    setLocalUser(userInfo);

    const langSupport = languageSupport(activeFileId);

    extensionsRef.current = [
      basicSetup(),
      yCollab(ytext, awareness, { undoManager })
    ]

    if ( langSupport ) extensionsRef.current.push(langSupport)

    // Set up CodeMirror and extensions
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        ...extensionsRef.current, colScheme.colorScheme === 'dark' ? themeDark: themeLight,
        activeLineTheme()
      ],
    });

    // Attach CodeMirror to element
    const view = new EditorView({
      state,
      parent: element,
    });

    viewRef.current = view;

    return () => {
      ydoc?.destroy();
      view?.destroy();
    };

  }, [element, room, userInfo]);
  
  // reload editor in for new active file
  // [ RUNS : ON EACH CHANGE OF activeFileId ]
  useEffect(() => {
    if (!viewRef.current) return;

    const ytext = getFileText(activeFileId);
    const undoManager = getUndoManager(activeFileId);
    undoManagerRef.current = undoManager;
    
    extensionsRef.current = [
      basicSetup(),
      yCollab(ytext, awareness, { undoManager })
    ]
    
    const langSupport = languageSupport(activeFileId);
    if ( langSupport ) extensionsRef.current.push(langSupport)

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        ...extensionsRef.current, colScheme.colorScheme === 'dark' ? themeDark: themeLight,
        activeLineTheme()
      ],
    });

    viewRef.current.setState(state);

    setActiveFile(activeFileId)
  }, [activeFileId])

  useEffect(() => {
    viewRef.current?.dispatch({effects: StateEffect.reconfigure.of([
      ...extensionsRef.current,
      colScheme.colorScheme === 'dark' ? themeDark: themeLight,
      activeLineTheme()
    ])})
  }, [colScheme.colorScheme])

  return {ref: returnRef, deleteFile, ydoc, undoManagerRef}
  
}