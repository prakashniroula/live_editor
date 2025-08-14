import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_API_KEY!,
});

function randomToken() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 16)
}

export async function POST(request: NextRequest) {

  const { name, imageUrl, desc } = await request.json();
  const randomId = randomToken().slice(0, 8)
  const roomId = `live-collab-${randomId}-${name}`;
  const shareToken = `${name}:${randomId}${randomToken()}`;
  const hostToken = randomToken();
  const viewToken = randomToken();
  
  const response = await liveblocks.createRoom(roomId, {
    defaultAccesses: [],
    metadata: {
      shareToken,
      hostToken,
      viewToken,
      desc,
      imageUrl
    }
  });

  const time = response.createdAt.getTime()
  return new Response(JSON.stringify({success: true, roomId, shareToken, hostToken, viewToken, time}));
}