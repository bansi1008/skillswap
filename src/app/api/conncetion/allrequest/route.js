import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentuser = await authenticate(req);
    if (!currentuser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const users = await User.find({
      _id: { $in: currentuser.connectionRequestsReceived },
    }).select(
      "-password -email -connectionRequestsReceived -connectionRequestsSent"
    );

    return new Response(JSON.stringify({ users }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch connection requests" }),
      { status: 500 }
    );
  }
}
