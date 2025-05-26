import { authenticate } from "@/lib/authmiddelware";

export async function PATCH(req) {
  try {
    const { skillToRemove, skillType } = await req.json();

    // Validate input
    if (!skillToRemove || !skillType) {
      return new Response(
        JSON.stringify({
          message:
            "Skill name and type (skillsOffered or skillsWanted) are required",
        }),
        { status: 400 }
      );
    }

    if (!["skillsOffered", "skillsWanted"].includes(skillType)) {
      return new Response(
        JSON.stringify({
          message:
            "Invalid skill type. Must be 'skillsOffered' or 'skillsWanted'",
        }),
        { status: 400 }
      );
    }

    const user = await authenticate(req);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check if skill exists in the user's profile
    const skillArray = user[skillType] || [];
    const skillIndex = skillArray.indexOf(skillToRemove);

    if (skillIndex === -1) {
      return new Response(
        JSON.stringify({
          message: `Skill "${skillToRemove}" not found in ${skillType}`,
        }),
        { status: 404 }
      );
    }

    // Remove the skill from the array
    skillArray.splice(skillIndex, 1);
    user[skillType] = skillArray;

    await user.save();

    return new Response(
      JSON.stringify({
        message: "Skill removed successfully",
        user: {
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove skill error:", error);
    return new Response(
      JSON.stringify({
        message: error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
