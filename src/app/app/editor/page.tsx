"use client";
import Editor from '@/components/ui/Editor/Editor';
import SidebarMobile from '@/components/ui/Sidebar/SidebarMobile';
import { useIDBState } from '@/hooks/useIDBState';
import { Box, Loader, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { Room } from '../Room';
import style from './editor.module.css';
import { modals, ModalsProvider } from '@mantine/modals';

export default function EditorPage() {
  const sidebarDisclosure = useDisclosure(false);

  const [projectName, setProjectName] = useState('');
  const {value: roomId, loading: loadingRoomId} = useIDBState('roomId', '')
  const {value: shareToken, loading: loadingToken} = useIDBState('shareToken', '')

  useEffect(() => {
    if (!roomId) return;
    const sliceUpto = 'live-collab-01234567-' // example bloat
    setProjectName(roomId.slice(sliceUpto.length));
  }, [loadingRoomId])

  const BoxRef = useRef<HTMLDivElement>(null);

  return (
    <Box ref={BoxRef} id='editorMain' className={`flex flex-col pt-4 pr-0 max-w-full w-full h-full justify-start ${style.root}`}>
      {(loadingRoomId || loadingToken) ? (
        <Box className='flex w-full h-full justify-center items-center'>
          <Loader variant='oval'/>
        </Box>
      ):
        (roomId && shareToken) ? (
        <Room roomId={roomId} shareToken={shareToken} >
          <Editor editorRef={BoxRef} projectName={projectName} roomId={roomId} />
        </Room>):(
          <Box className='flex w-full h-full justify-center items-center'>
            <Text> Open a project first 🚀✨</Text>
          </Box>
        )
      }
      <SidebarMobile sidebarDisclosure={sidebarDisclosure}/>
    </Box>
  )
}