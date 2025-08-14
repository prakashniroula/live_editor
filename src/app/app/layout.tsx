"use client";
import LightDarkMode from '@/components/ui/LightDarkMode/LightDarkMode';
import Logo from '@/components/ui/Logo/Logo';
import { Sidebar } from '@/components/ui/Sidebar/Sidebar'
import SidebarMobile from '@/components/ui/Sidebar/SidebarMobile'
import { Routes } from '@/routes/routes';
import { ActionIcon, Box } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMenu2 } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import style from './layout.module.css';
import UserInfoRequired from '@/components/ux/UserInfoRequired';
import React from 'react';

type Props = { children: React.ReactNode }

function LayoutHelper({curRoute, children}: {curRoute: string, children: React.ReactNode}) {
  const sidebarDisclosure = useDisclosure(false);
  if ( curRoute === Routes.app ) return (<>
    <LightDarkMode forceDisplay/>
    {children}
  </>)
  return <Box className={`w-screen h-screen flex max-md:flex-col`}>
    <Sidebar className='max-md:hidden' />
    <div className={`md:hidden flex w-full justify-between relative py-2 ${curRoute === Routes.editor ? `${style.mobileNavBg} px-2` : 'px-8'}`}>
      <div className="flex gap-4">
        <ActionIcon size='lg' variant='default' bg='none' onClick={sidebarDisclosure[1].open}>
          <IconMenu2 size={16} />
        </ActionIcon>
        <Logo />
      </div>
      <LightDarkMode mobile />
    </div>
    <SidebarMobile sidebarDisclosure={sidebarDisclosure} />
    {children}
  </Box >
}

export default function Layout({ children }: Props) {
  const curRoute = usePathname();
  return (curRoute === Routes.app) ? (
    <LayoutHelper curRoute={curRoute} >
      {children}
    </LayoutHelper>
  ): (
    <UserInfoRequired>
      <LayoutHelper curRoute={curRoute}>
        {children}
      </LayoutHelper>
    </UserInfoRequired>
  )
}