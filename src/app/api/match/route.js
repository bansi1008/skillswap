import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";

// Helper to normalize skills: trim + lowercase
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return skills.map((skill) => skill.trim().toLowerCase());
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const currentuser = await authenticate(req);

    if (!currentuser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Normalize current user's skillsWanted and skillsOffered
    const skillsWantedNorm = normalizeSkills(currentuser.skillsWanted || []);
    const skillsOfferedNorm = normalizeSkills(currentuser.skillsOffered || []);

    // Find users excluding current user who have any overlap in skills (case sensitive query)
    // Note: MongoDB query is still case sensitive here, but this will limit candidates roughly.
    const potentialMatches = await User.find({
      _id: { $ne: currentuser._id },
      $or: [
        { skillsOffered: { $in: currentuser.skillsWanted || [] } },
        { skillsWanted: { $in: currentuser.skillsOffered || [] } },
      ],
    });

    // Filter and calculate matchScore using normalized skills
    const matchwiths = potentialMatches.map((user) => {
      const userSkillsOfferedNorm = normalizeSkills(user.skillsOffered || []);
      const userSkillsWantedNorm = normalizeSkills(user.skillsWanted || []);

      // Count matches based on normalized skills
      const matchSkills = userSkillsOfferedNorm.filter((skill) =>
        skillsWantedNorm.includes(skill)
      ).length;

      const wantedmatchSkills = userSkillsWantedNorm.filter((skill) =>
        skillsOfferedNorm.includes(skill)
      ).length;

      const matchScore = matchSkills + wantedmatchSkills;

      return {
        name: user.name,
        id: user._id,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        location: user.location,
        matchScore,
      };
    });

    matchwiths.sort((a, b) => b.matchScore - a.matchScore);

    return new Response(JSON.stringify({ matchwiths }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
