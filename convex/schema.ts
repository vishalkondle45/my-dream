import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  notes: defineTable({
    title: v.optional(v.string()),
    note: v.string(),
    color: v.optional(v.string()),
    isTrashed: v.boolean(),
    isPinned: v.boolean(),
    category: v.optional(v.string()),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
