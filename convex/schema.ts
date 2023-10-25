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

  todos: defineTable({
    todo: v.string(),
    title: v.optional(v.string()),
    completedOn: v.optional(v.string()),
    isAddedToMyDay: v.boolean(),
    isImportant: v.boolean(),
    date: v.optional(v.string()),
    notes: v.optional(v.string()),
    category: v.optional(v.array(v.string())),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
