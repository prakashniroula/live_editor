"use client"
import ProjectList from '@/components/ui/Projects/ProjectList'
import ProjectMenu from '@/components/ui/Projects/ProjectMenu'
import { useIDBState } from '@/hooks/useIDBState'
import { useProjects } from '@/hooks/useProjects'
import { Routes } from '@/routes/routes'
import { Box, Loader } from '@mantine/core'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Projects() {

  const useProj = useProjects();
  const { loading } = useProj;

  const {updateValue: updateRoomId} = useIDBState("roomId", '')
  const {updateValue: updateShareToken} = useIDBState("shareToken", '')

  const openProject = (projName: string, roomId: string) => {
    updateRoomId(roomId);
    updateShareToken(useProj.projects[roomId].shareToken)
    setTimeout(() => redirect(Routes.editor), 100);
  }

  if ( loading ) return (
    <div className='flex w-full h-full justify-center items-center'>
      <Loader variant='oval' />
    </div>
  )

  return (
    <Box className='flex flex-col pt-4 pr-0 w-full h-full justify-start'>
      <ProjectMenu useProj={useProj} />
      <ProjectList openProject={openProject} useProj={useProj} />
    </Box>
  )
}