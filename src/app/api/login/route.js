import bycrypt from "bcryptjs";
import User from "@/model/user";
import { connectToDatabase } from "@/lib/dbconfig";
import { generateToken } from "@/lib/jwt";

export async function POST(request) {
  const { email, password } = await request.json();
  try {
    await connectToDatabase();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          message: "Email does not exist, feel free to signup with it",
        }),
        {
          status: 400,
        }
      );
    }

    const isPasswordCorrect = await bycrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({
          message: "Incorrect password",
        }),
        {
          status: 400,
        }
      );
    }
    const token = generateToken(existingUser);

    return Response.json(
      {
        message: "Login successful",
        token,
        UserId: existingUser._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
