import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { isHttpError } from "../../utils";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_API_KEY!,
});

export async function POST(request: NextRequest) {

  const { roomId, hostToken } = await request.json();
  let body;
  try {
    const response = await liveblocks.getRoom(roomId);
    if ( response.metadata.hostToken === hostToken ) {
      await liveblocks.deleteRoom(roomId);
      body = JSON.stringify({success: true});
    } else {
      body = JSON.stringify({success: false, reason: "Invalid hostToken"});
    }
  } catch (err: unknown) {
    if (!isHttpError(err)) return;
    if ( err.status == 404 ) {
      body = JSON.stringify({success: false, reason: "Invalid roomId"});
    }
  }

  return new Response(body);
}