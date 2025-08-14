"use client"

import useColorScheme from '@/hooks/useColorScheme'
import { ActionIcon } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

const LightDarkMode = ({forceDisplay=false, mobile = false}) => {
  const theme = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  const checkAndToggle = () => {
    if ( theme.colorScheme === 'dark' ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }

  useEffect(() => {
    checkAndToggle();
  }, [theme.colorScheme])

  return (
    <div className={`${!mobile && 'absolute right-4 top-4 z-50'} ${!forceDisplay && !mobile && 'max-md:hidden'}`}>
      <ActionIcon size='lg' variant="default" onClick={theme.toggleColorScheme} {...mobile && {bg: 'none'}}>
        <IconMoon size={20} className={!isDark ? '': 'hidden'} />
        <IconSun size={20} className={isDark ? '': 'hidden'} />
      </ActionIcon>
    </div>
  )
}

export default LightDarkMode