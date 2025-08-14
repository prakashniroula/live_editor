"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { Loader } from "@mantine/core";
import { get } from "idb-keyval";
import { ReactNode, useEffect, useMemo, useState } from "react";

type User = {
  id: string,
  info: {
    name: string,
    color: string,
    colorLight: string,
    picture?: string
  }
}

function randomInt(a: number, b?: number): number {
  if ( b === undefined ) {
    b = a; a = 0;
  }
  return ((Math.random()*2**64) % (b-a) + a)
}

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // version/variant bits
    return v.toString(16);
  });
}

export function Room({ children, roomId, shareToken }: { children: ReactNode, roomId: string, shareToken: string }) {

  const [token, setToken] = useState<string>();
  
  const defaultUser = useMemo(() => {
    const hue = randomInt(360);
    return {
      id: `user-${randomUUID()}`,
      info: {
        name: `Anonymous#${randomInt(9999)}`,
        color: `hsl(${hue},78%,50%)`,
        colorLight: `hsla(${hue},54%,74%,80%)`
      }
    };
  }, [])
  
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User|null>(null);

  useEffect(() => {
    get<User|''>("userProfile").then(x => {
      if(!x) {setUserInfo(defaultUser)} else {setUserInfo(x)}
    })
  }, [])
  
  useEffect(() => {
    if (!userInfo) return;
    fetch('/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({
        user: userInfo,
        room: roomId,
        shareToken: shareToken
      })
    }).then(x => x.json()).then(x => {
      if(!x) return;
      setToken(x);
      setLoading(false);
    })
  }, [roomId, userInfo])
  
  if (loading) return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader variant="oval"/>
    </div>
  )
  
  return (
    /// @ts-expect-error token can't be undefined
    <LiveblocksProvider authEndpoint={() => new Promise(r => r(token))}>
      <RoomProvider id={roomId} >
        <ClientSideSuspense fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Loader variant="oval"/>
          </div>
        }>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}