import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";

export async function POST(req) {
  try {
    await connectToDatabase();
    const currentuser = await authenticate(req);
    if (!currentuser) {
      console.log("currentuser not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const { fromUserId } = await req.json();
    if (!fromUserId) {
      return new Response(
        JSON.stringify({ message: "Target user ID is required" }),
        {
          status: 400,
        }
      );
    }

    const senduser = await User.findById(fromUserId);
    if (!senduser) {
      console.log("senduser not found");
      return new Response(
        JSON.stringify({ message: "Target user not found" }),
        {
          status: 404,
        }
      );
    }

    currentuser.connections.push(fromUserId);
    senduser.connections.push(currentuser._id);

    currentuser.connectionRequestsReceived =
      currentuser.connectionRequestsReceived.filter(
        (id) => id.toString() !== fromUserId
      );
    senduser.connectionRequestsSent = senduser.connectionRequestsSent.filter(
      (id) => id.toString() !== currentuser.id
    );
    await currentuser.save();
    await senduser.save();

    return new Response(
      JSON.stringify({
        message: "Connection request accepted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
