import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_API_KEY!,
});

export async function POST(req: NextRequest) {
  
  // Give the user access to the room
  const request = await req.json();

  let room, user, shareToken;
  
  try {
    ({ room, user, shareToken } = request);
  } catch(e: unknown) {
    return new Response(JSON.stringify({success: false, reason: "Invalid parameters"}))
  }

  console.log(room, {room});
  // const response = await liveblocks.getRoom()
  
  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(user.id, {
    userInfo: user.info,
  });

  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  console.log(body, status);
  return new Response(JSON.stringify({token: JSON.parse(body).token, success: true}), { status });

}