import User from "@/model/user";
import { connectToDatabase } from "@/lib/dbconfig";
import { authenticate } from "@/lib/authmiddelware";

export async function GET(req) {
  try {
    await connectToDatabase();

    const currentUser = await authenticate(req);

    if (!currentUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const user = await User.findById(id)
      .select("-password -confirmPassword")
      .lean();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
