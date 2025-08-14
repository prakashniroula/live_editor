"use client"
import { Box, Loader } from '@mantine/core'
import React from 'react'
import { AuthForm } from './AuthForm'
import { useIDBState } from '@/hooks/useIDBState'
import { User } from '@/utils/userType'

export default function Page() {

  const {value, updateValue, loading} = useIDBState<User|''>("userProfile", '')
  
  if ( loading ) return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader variant='oval'/>
    </div>
  )

  return (
    <Box className='w-full h-full overflow-hidden'>
      {
        value !== '' ?
        <AuthForm updateValue={updateValue} value={value} joined />:
        <AuthForm updateValue={updateValue} />
    }
    </Box>
  )
}