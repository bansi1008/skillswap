import { authenticate } from "@/lib/authmiddelware";
import { connectToDatabase } from "@/lib/dbconfig";
import User from "@/model/user";

export async function GET(req) {
  try {
    await connectToDatabase();

    const currentuser = await authenticate(req);

    if (!currentuser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const { _id, skillsWanted = [], skillsOffered = [] } = currentuser;
    const potentialMatches = await User.find({
      _id: { $ne: _id },
      skillsOffered: { $in: skillsWanted },
    });
    const matchwiths = potentialMatches.map((user) => {
      const matchSkills = user.skillsOffered.filter((skill) =>
        skillsWanted.includes(skill)
      ).length;

      const wantedmatchSkills = user.skillsWanted.filter((skill) =>
        skillsOffered.includes(skill)
      ).length;

      const matchScore = matchSkills + wantedmatchSkills;
      return {
        name: user.name,
        email: user.email,
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
