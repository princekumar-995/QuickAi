export const requireBlogAuth = (req, res, next) => {
  if (req.auth && req.auth.userId) {
    return next();
  }

  // Dev fallback to ensure local testing and backend checks can proceed without active session tokens
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    console.warn("⚠️ [Auth] No active Clerk session. Using development mock user fallback.");
    req.auth = {
      userId: "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
      fullName: "Quick.ai Developer",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    };
    return next();
  }

  return res.status(401).json({ success: false, message: "Unauthorized. Please sign in to perform this action." });
};
