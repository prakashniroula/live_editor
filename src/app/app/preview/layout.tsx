"use client"
import { Loader } from "@mantine/core";
import { Room } from "../Room";
import React from "react";
import { useIDBState } from "@/hooks/useIDBState";

export default function Layout({children}:{children: React.ReactNode}) {
  
  const {value: roomId, loading} = useIDBState('roomId', '')
  const {value: shareToken, loading: loadingToken} = useIDBState('shareToken', '')

  if (loading || loadingToken) return <Loader/>
    
  return <Room roomId={roomId} shareToken={shareToken}>
    {children}
  </Room>
}