import { ActionIcon, Text } from '@mantine/core'
import React from 'react'
import style from './EditorTools.module.css'

export function EditorTools({hideOnMobile, name, value, Icon, onClick, iconProps, textProps}:
  {hideOnMobile?: boolean, name: string, value: string, Icon: React.ReactNode, onClick: (v:string) => void,  iconProps?: object, textProps?: object}) {
  return (
    <div className={`relative w-full max-w-12 ${hideOnMobile && 'max-md:hidden'} cursor-pointer hover:opacity-80`} onClick={() => onClick(value)}>
      <ActionIcon {...iconProps} size='lg' variant='default' bd={0} p={1} bg='none' className='relative'>
        {Icon}
      </ActionIcon>
      <Text size='xs' {...textProps} className={style.editorToolTips}>{name}</Text>
    </div>
  )
}