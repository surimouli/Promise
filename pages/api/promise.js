import { getAuth } from "@clerk/nextjs/server";
import { db } from "../../lib/db";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional().nullable(),
});

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // Ensure internal user exists
  const user =
    (await db.user.findUnique({ where: { clerkId: userId } })) ??
    (await db.user.create({ data: { clerkId: userId } }));

  if (req.method === "GET") {
    const active = await db.promise.findFirst({
      where: { userId: user.id, isActive: true },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    return res.status(200).json({ active });
  }

  if (req.method === "POST") {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Deactivate any existing active promise
    await db.promise.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false },
    });

    const created = await db.promise.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        isActive: true,
      },
    });

    return res.status(201).json({ promise: created });
  }

  return res.status(405).json({ error: "Method not allowed" });
}