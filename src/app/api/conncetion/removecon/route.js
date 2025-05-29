import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const currentuser = await authenticate(req);
    if (!currentuser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const { connectionId } = await req.json();
    if (!connectionId) {
      return new Response(
        JSON.stringify({ message: "Connection ID is required" }),
        { status: 400 }
      );
    }

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return new Response(
        JSON.stringify({ message: "Connection user not found" }),
        { status: 404 }
      );
    }

    currentuser.connections = currentuser.connections.filter(
      (id) => id.toString() !== connectionId
    );
    connectionUser.connections = connectionUser.connections.filter(
      (id) => id.toString() !== currentuser._id.toString()
    );

    await currentuser.save();
    await connectionUser.save();

    return new Response(
      JSON.stringify({ message: "Connection removed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing connection:", error);
    return new Response(
      JSON.stringify({ message: "Failed to remove connection" }),
      { status: 500 }
    );
  }
}
