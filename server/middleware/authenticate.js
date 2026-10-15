const crypto = require("crypto");

const getSecret = () => process.env.AUTH_TOKEN_SECRET;

const createToken = (user) => {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_TOKEN_SECRET is not configured");

  const payload = Buffer.from(JSON.stringify({
    user_id: user.user_id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const authenticate = (req, res, next) => {
  const secret = getSecret();
  if (!secret) {
    return res.status(503).json({ success: false, message: "Authentication is not configured" });
  }

  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  const expected = crypto.createHmac("sha256", secret).update(payload).digest();
  let actual;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!user.user_id || !user.exp || user.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { authenticate, createToken };
