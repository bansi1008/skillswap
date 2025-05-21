import { connectToDatabase } from "@/lib/dbconfig";
import { authenticate } from "@/lib/authmiddelware";
import User from "@/model/user";

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await authenticate(req);
    if (!currentUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const user = await User.find(
      {},
      { password: 0, confirmPassword: 0, email: 0 }
    ).lean();
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ user, totallength: user.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
