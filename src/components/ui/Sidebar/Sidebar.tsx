"use client";

import { Routes, SidebarRoutes } from '@/routes/routes';
import { ActionIcon, Center, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconArrowBarLeft,
  IconHome2
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import style from './Sidebar.module.css';

interface SidebarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ icon: Icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <Tooltip transitionProps={{ transition: 'fade', duration: 200 }} label={label} position="right" >
      <UnstyledButton onClick={onClick} className={style.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function Sidebar({ className = "", extended = false, mobile = false, onSidebarCollapse = (() => { }) }) {
  // force extended sidebar in mobile
  if (mobile) extended = true;

  const route = usePathname();
  const [active, setActive] = useState(route);

  useEffect(() => {
    setActive(route)
  }, [route]);

  if (route === Routes.app) return <></>

  const links = Object.entries(SidebarRoutes).map(([route, { icon, label }]) => (
    <Link href={route} key={`${label}:${route}`} className={`${style.mainLink} ${active === route && style.mainLinkActive}`}>
      <SidebarLink
        icon={icon}
        label={label}
        active={active === route}
        onClick={() => {
          setActive(route);
        }}
      />
      {extended && <Text>{label}</Text>}
    </Link>
  ));

  return (
    <nav className={`flex ${!mobile && route === Routes.editor && 'max-md:hidden'} ${style.sidebar} ${extended && style.extended} ${className} `}>
      <Center className='px-4 pt-4'>
        {extended ? (
          <div className="flex justify-between w-full p-0">
            <Logo />
            {extended && (
              <ActionIcon variant='none' onClick={onSidebarCollapse} size='lg'>
                <IconArrowBarLeft />
              </ActionIcon>
            )}
          </div>
        ) : (
          <Logo />
        )}
      </Center>

      <div className={style.sidebarMain}>
        <Stack className='h-full' justify="center" gap={'auto'}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}