import { useIDBState } from './useIDBState';


export type ProjectInfo = {
  name: string,
  imageUrl: string | null,
  hostToken?: string,
  desc: string,
  time: number,
  shareToken: string,
  roomId: string
}

export type Projects = {
  [roomId: string]: ProjectInfo
}

type createProjectFnArg = { name: string, imageUrl?: string | null, desc?: string }

export type useProjRet = {
  loading: boolean, projects: Projects, createProject: (x: createProjectFnArg) => Promise<ProjectInfo | null>,
  deleteProject: (roomId: string, selfOnly?: boolean) => Promise<boolean | null>,
  joinProject: (sharedToken: string, hostToken?: string) => Promise<ProjectInfo | null>
}


export const useProjects = (): useProjRet => {

  const {value: projects, loading, updateValue: updateProjects} = useIDBState<Projects>("LiveProjects", {});

  const createProject = async ({ name, imageUrl = null, desc = '' }: createProjectFnArg): Promise<ProjectInfo | null> => {
    try {
      // create project online
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        body: JSON.stringify({
          name,
          desc,
          imageUrl
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const { hostToken, shareToken, roomId, time } = await response.json();
      if (!hostToken || !shareToken || !roomId) return null;

      const project = {
        name,
        desc,
        imageUrl,
        hostToken,
        shareToken,
        roomId,
        time
      }

      updateProjects({ ...projects, [roomId]: project });
      return project;
    } catch (_) {
      return null;
    }
  }

  const joinProject = async (shareToken: string, hostToken?: string): Promise<ProjectInfo | null> => {
    try {
      
      const body = hostToken ? JSON.stringify({shareToken, hostToken}): JSON.stringify({shareToken})
      const response = await fetch('/api/projects/join', {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json();
      if (!json.success) return null;

      const { name, imageUrl, roomId, desc, time } = json;

      const project: ProjectInfo = {
        name,
        desc,
        time,
        imageUrl,
        roomId,
        shareToken
      }

      if ( hostToken ) {
        project.hostToken = hostToken
      }

      updateProjects({ ...projects, [roomId]: project });
      return project;
    } catch (_) {
      return null;
    }
  }

  // only host can delete a project
  const deleteProject = async (roomId: string, selfOnly?: boolean) => {

    let success: boolean;

    if (!selfOnly) {
      try {
        const response = await fetch('/api/projects/delete', {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            hostToken: projects[roomId].hostToken
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const resp = await response.json();
        success = resp.success
      } catch (_) {
        return false;
      }

    } else {
      success = true;
    }

    if (success !== false) {
      const { [roomId]: _, ...newProj } = projects;
      updateProjects(newProj);
    }

    return success;
  }

  return {
    loading, projects, createProject, joinProject, deleteProject
  }
}