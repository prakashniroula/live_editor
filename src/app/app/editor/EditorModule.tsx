"use client";
import Editor from '@/components/ui/Editor/Editor';
import SidebarMobile from '@/components/ui/Sidebar/SidebarMobile';
import { Box, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Room } from '../Room';
import style from './editor.module.css';
import { useRef } from 'react';

type Props = {roomId: string, shareToken: string, projectName: string, id?: string}

export default function EditorModule({id, roomId, shareToken, projectName}: Props) {
  
  const sidebarDisclosure = useDisclosure(false);

  const BoxRef = useRef<HTMLDivElement>(null);

  return (
    <Box ref={BoxRef} id={id} className={`scroll-m-16 mt-16 flex flex-col pt-4 pr-0 max-w-full w-full h-full justify-start ${style.root}`}>
      <div className="flex w-full justify-center">
        <Text c='blue'>Note : This instance is shared across anyone live...</Text>
      </div>
      <Room roomId={roomId} shareToken={shareToken} >
        <Editor editorRef={BoxRef} projectName={projectName} roomId={roomId} />
      </Room>
      <SidebarMobile sidebarDisclosure={sidebarDisclosure}/>
    </Box>
  )
}