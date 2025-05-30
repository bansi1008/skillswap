import { authenticate } from "@/lib/authmiddelware";
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return skills;
  return skills.map((skill) => skill.trim().toLowerCase());
}

export async function PATCH(req) {
  const { skillsWanted, skillsOffered, location, bio, portfolioLinks } =
    await req.json();

  try {
    const user = await authenticate(req);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    user.skillsWanted = skillsWanted
      ? normalizeSkills(skillsWanted)
      : user.skillsWanted;
    user.skillsOffered = skillsOffered
      ? normalizeSkills(skillsOffered)
      : user.skillsOffered;
    user.location = location || user.location;
    user.bio = bio || user.bio;
    user.portfolioLinks = portfolioLinks || user.portfolioLinks;

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
