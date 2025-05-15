import { connectToDatabase } from "../../../lib/dbconfig";

export async function GET() {
  try {
    await connectToDatabase();
    return new Response(
      JSON.stringify({ message: "Connected to MongoDB successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to connect to MongoDB" }),
      { status: 500 }
    );
  }
}
