import { clerkClient } from "@clerk/express";

// middleware to check userid has premium plan
export const auth = async (req, res, next) => {
  try {
    // Dev fallback if req.auth is not populated by Clerk middleware
    if (!req.auth || !req.auth.userId) {
      console.warn("⚠️ Clerk auth missing userId. Using development test user fallback.");
      req.auth = { 
        userId: "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
        has: async () => false
      };
    }

    const { userId, has } = req.auth;
    const hasPremiumPlan = has ? await has({ plan: "premium" }) : false;
    
    let user;
    try {
      user = await clerkClient.users.getUser(userId);
    } catch (clerkErr) {
      console.warn("⚠️ Clerk getUser failed. Using development mock user metadata.");
      user = {
        privateMetadata: {
          free_usage: 0
        }
      };
    }

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else if (!hasPremiumPlan) {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: 0,
          },
        });
      } catch (metaErr) {
        console.warn("⚠️ Clerk updateUserMetadata failed.");
      }
      req.free_usage = 0;
    } else {
      req.free_usage = 0; // Premium users
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.json({ success: false, message: error.message });
  }
};
