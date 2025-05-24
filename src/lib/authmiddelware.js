import jwt from "jsonwebtoken";
import User from "@/model/user";
import { connectToDatabase } from "@/lib/dbconfig";

export const authenticate = async (req) => {
  const cookieHeader = req.headers.get("cookie");
  const tokenMatch = cookieHeader?.match(/token=([^;]+)/);
  const token = tokenMatch?.[1];

  if (!token) {
    throw new Error("No token provided in cookies");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};
