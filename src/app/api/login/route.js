// import bycrypt from "bcryptjs";
// import User from "@/model/user";
// import { connectToDatabase } from "@/lib/dbconfig";
// import { generateToken } from "@/lib/jwt";

// export async function POST(request) {
//   const { email, password } = await request.json();
//   try {
//     await connectToDatabase();

//     if (!email || !password) {
//       return new Response(
//         JSON.stringify({ error: "All fields are required" }),
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return new Response(
//         JSON.stringify({
//           message: "Email does not exist, feel free to signup with it",
//         }),
//         {
//           status: 400,
//         }
//       );
//     }

//     const isPasswordCorrect = await bycrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!isPasswordCorrect) {
//       return new Response(
//         JSON.stringify({
//           message: "Incorrect password",
//         }),
//         {
//           status: 400,
//         }
//       );
//     }
//     const token = generateToken(existingUser);

//     return Response.json(
//       {
//         message: "Login successful",
//         token,
//         UserId: existingUser._id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Login Error:", error);
//     return new Response(JSON.stringify({ message: "Internal server error" }), {
//       status: 500,
//     });
//   }
// }

import bcrypt from "bcryptjs";
import User from "@/model/user";
import { connectToDatabase } from "@/lib/dbconfig";
import { generateToken } from "@/lib/jwt";

export async function POST(request) {
  const { email, password, rememberMe } = await request.json();

  try {
    await connectToDatabase();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = generateToken(existingUser);

    // Build cookie options based on rememberMe
    const cookieOptions = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      "SameSite=Strict",
    ];

    // Only add Secure flag in production (HTTPS)
    if (process.env.NODE_ENV === "production") {
      cookieOptions.push("Secure");
    }

    // If rememberMe is true, set cookie to expire in 7 days
    // If rememberMe is false, don't add Max-Age (makes it a session cookie)
    if (rememberMe) {
      const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
      cookieOptions.push(`Max-Age=${maxAge}`);
    }

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieOptions.join("; "),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
