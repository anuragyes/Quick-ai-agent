import { clerkClient } from '@clerk/express';

// Middleware to check userId and if the user has a premium plan
export const auth = async (req, res, next) => {
  try {
    // Assuming `req.auth()` returns an object with userId and a `has` function
    const { userId, has } = await req.auth(); 

    // Check if the user has a premium plan
    const hasPremiumPlan = await has({ plan: "premium" });

    // Get user data from Clerk
    const user = await clerkClient.users.getUser(userId);

    // If there's no userId, return Unauthorized
    if (!userId) {
      console.error("❌ Missing userId in token payload");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If user doesn't have a premium plan and they have free usage, keep track of it
    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      // Reset free usage to 0 if user has a premium plan or no usage recorded
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: 0 },
      });
      req.free_usage = 0;
    }

    // Set the plan type (premium or free) for the request
    req.plan = hasPremiumPlan ? "premium" : "free";

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // In case of any error, respond with an error message
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ success: false, message: error.message });
  }
};

