import { authenticate } from "@/lib/authmiddelware";

export async function PATCH(req) {
  const { skillsWanted, skillsOffered, location } = await req.json();

  try {
    const user = await authenticate(req);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (!location) {
      return new Response(JSON.stringify({ message: "Location is required" }), {
        status: 400,
      });
    }

    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.location = location || user.location;

    await user.save();

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
