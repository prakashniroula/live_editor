import { useProjRet } from '@/hooks/useProjects'
import { Box, SimpleGrid } from '@mantine/core'
import ProjectItem from './ProjectItem'

type Props = {useProj: useProjRet, openProject: (prjName:string, roomId:string) => void}

const ProjectList = ({useProj, openProject}: Props) => {
  
  const {projects, deleteProject} = useProj;

  if ( Object.keys(projects).length === 0 ) {
    return <div className='flex flex-col w-full h-full justify-center items-center gap-2'>
      <span className='flex gap-2'><span>No projects</span><span>:(</span></span>
      <span>Start building ✨🚀</span>
    </div>
  }

  return (
    <SimpleGrid cols={{xs: 2, sm: 3, md: 4, xl: 5}} className='w-full h-full overflow-y-auto px-8 z-0 pt-2'>
      {Object.entries(projects).map(([roomId, {name, imageUrl, desc, time, shareToken, hostToken}], i) => {
        const timeDiff = (Date.now() - time) / 1000
        const timeStr = (
          timeDiff < (60*60) ? `${Math.floor(timeDiff / 60)}m`:
          timeDiff < (3600*24) ? `${Math.floor(timeDiff / 360)/10}h`:
          timeDiff < (3600*24*7) ? `${Math.floor(timeDiff / 360 / 24)/10}d`:
          timeDiff < (3600*24*30) ? `${Math.floor(timeDiff / 360 / 24 / 7)/10}w`:
          timeDiff < (3600*24*365) ? `${Math.floor(timeDiff / 360 / 24 / 30)/10}mo`:
          `${Math.floor(timeDiff / 360 / 24 / 365)/10}y`
        )
        return (
        <Box key={`box-${i}`} className='pb-4'>
          <ProjectItem
            onClick={() => openProject(name, roomId)}
            shareToken={shareToken}
            hostToken={hostToken}
            onDelete={async (selfOnly: boolean) => deleteProject(roomId, selfOnly=selfOnly)}
            imageW='100%' imageH={200} title={name} description={desc} imageUrl={imageUrl || null} imageAlt='Project Image' time={timeStr}
          />
        </Box>
      )})}
    </SimpleGrid>
  )
}

export default ProjectList