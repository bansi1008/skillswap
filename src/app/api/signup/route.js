const User = require("../../../model/user");
const { connectToDatabase } = require("../../../lib/dbconfig");

export async function POST(request) {
  const {
    name,
    email,
    password,
    confirmPassword,
    skillsWanted,
    skillsOffered,
    location,
  } = await request.json();

  try {
    await connectToDatabase();

    if (!name || !email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Email already exists, feel free to login with it",
        }),
        {
          status: 400,
        }
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { message: "Password and confirm password do not match." },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      confirmPassword,
      location,
      skillsWanted,
      skillsOffered,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}
