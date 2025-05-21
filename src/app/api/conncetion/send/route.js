import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";

export async function POST(req) {
  try {
    await connectToDatabase();
    const currentuser = await authenticate(req);
    if (!currentuser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return new Response(
        JSON.stringify({ message: "Target user ID is required" }),
        {
          status: 400,
        }
      );
    }
    if (currentuser._id.toString() === targetUserId) {
      return new Response(
        JSON.stringify({
          message: "You cannot send a connection request to yourself",
        }),
        {
          status: 400,
        }
      );
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return new Response(
        JSON.stringify({ message: "Target user not found" }),
        {
          status: 404,
        }
      );
    }

    const alreadyConnected = currentuser.connections.includes(targetUserId);
    const alreadySent =
      currentuser.connectionRequestsSent.includes(targetUserId);
    const alreadyReceived =
      targetUser.connectionRequestsReceived.includes(targetUserId);

    if (alreadyConnected || alreadySent || alreadyReceived) {
      return new Response(
        JSON.stringify({
          message: "Connection request already sent or already connected",
        }),
        {
          status: 400,
        }
      );
    }
    currentuser.connectionRequestsSent.push(targetUserId);
    targetUser.connectionRequestsReceived.push(currentuser._id);
    await currentuser.save();
    await targetUser.save();
    return new Response(
      JSON.stringify({ message: "Connection request sent successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Connection request error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
