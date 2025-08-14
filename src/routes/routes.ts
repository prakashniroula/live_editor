import {
  IconCode,
  IconEyeCode,
  IconFolderCode,
  IconLogout2,
  IconPackageExport,
  IconPhotoVideo,
  IconSettings,
  IconUser
} from '@tabler/icons-react';

function Route({icon, label, route}:{icon: typeof IconCode, label: string, route: string}) {
  return {icon: icon, label: label, route: `/app/${route}`}
}

const Routes = {
  projects: '/app/projects',
  editor: '/app/editor',
  preview: '/app/preview',
  recordings: '/app/recordings',
  releases: '/app/releases',
  settings: '/settings',
  profile: '/profile',
  logout: '/logout',
  signup: '/sign-up',
  signin: '/sign-in',
  app: '/app',
  JoinCollab: (id: string) => `/join/collab/${id}`
}

const SidebarRoutes = {
  [Routes.projects] : {label: 'Projects', icon: IconFolderCode},
  [Routes.editor] : {label: 'Editor', icon: IconCode},
  [Routes.preview] : {label: 'Preview', icon: IconEyeCode},
  [Routes.recordings] : {label: 'Recordings', icon: IconPhotoVideo},
  [Routes.releases] : {label: 'Releases', icon: IconPackageExport},
  [Routes.settings] : {label: 'Settings', icon: IconSettings},
  [Routes.profile] : {label: 'Profile', icon: IconUser},
  [Routes.logout] : {label: 'Logout', icon: IconLogout2},
  // [Routes.signup] : {label: 'Signup', icon: IconFolderCode},
  // [Routes.signin] : {label: 'Signin', icon: IconFolderCode},
}

export { Routes, SidebarRoutes };
