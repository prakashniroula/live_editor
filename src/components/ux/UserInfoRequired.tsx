"use client"
import { useIDBState } from '@/hooks/useIDBState'
import { Routes } from '@/routes/routes'
import { Loader } from '@mantine/core'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {children: React.ReactNode}

export default function UserInfoRequired({children}: Props) {

  const {value, updateValue, loading} = useIDBState("userProfile", '')

  if ( loading ) return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader variant='oval'/>
    </div>
  )

  if ( !loading && !value ) {
    redirect(Routes.profile);
  }

  return value ? <>{children}</>: <></>
}