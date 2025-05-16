import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

export function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}
