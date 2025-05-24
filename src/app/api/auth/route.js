import { authenticate } from "@/lib/authmiddelware";

export async function GET(req) {
  try {
    const user = await authenticate(req);
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          id: user._id,
          email: user.email,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ authenticated: false, message: error.message }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
