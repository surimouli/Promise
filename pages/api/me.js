import { getAuth } from "@clerk/nextjs/server";
import { db } from "../../lib/db";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Find or create the user in our database
  let user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: { clerkId: userId },
    });
  }

  return res.status(200).json({ user });
}