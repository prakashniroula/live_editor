import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { isHttpError } from "../../utils";

const API_KEY = "sk_dev_sN3Y0qo16rD8eUctO-LI3662qq8PXiYe29N2QLTrIlGDzWyCJXRVlAayAf6qz9gZ";

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

export async function POST(request: NextRequest) {

  const req = await request.json();
  const { shareToken }:{shareToken: string} = req;
  
  const indexDelim = shareToken.indexOf(':')
  const token = shareToken.slice(indexDelim+1);
  const name = shareToken.slice(0, indexDelim);

  const roomId = `live-collab-${token.slice(0, 8)}-${name}`

  let body;
  try {
    const response = await liveblocks.getRoom(roomId);
    const metadata = response.metadata
    
    if ( req.hostToken && metadata.hostToken !== req.hostToken ) {
      body = JSON.stringify({success: false, reason: "Invalid Token"})
      return new Response(body);
    }

    if ( metadata.shareToken === shareToken ) {
      body = JSON.stringify({time: response.createdAt.getTime(), name, desc: metadata.desc, imageUrl: metadata.imageUrl, roomId, success: true})
    } else {
      body = JSON.stringify({success: false, reason: "Token has been changed."})
    }
  } catch (err: unknown) {
    if (!isHttpError(err)) return;
    if ( err.status === 404 ) {
      body = JSON.stringify({success: false, reason: "Invalid Token"})
    }
  }  

  return new Response(body);
}