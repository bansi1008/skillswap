import jwt from "jsonwebtoken";
import User from "@/model/user";
import { connectToDatabase } from "@/lib/dbconfig";

export const authenticate = async (req) => {
  const authHeader = req.headers.get("authorization");

  console.log("Auth Header:", req.headers.get("authorization"));

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    await connectToDatabase();
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};
