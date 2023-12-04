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
    list: v.optional(v.string()),
    completedOn: v.optional(v.string()),
    isAddedToMyDay: v.boolean(),
    isImportant: v.boolean(),
    date: v.optional(v.string()),
    notes: v.optional(v.string()),
    category: v.optional(v.array(v.string())),
    userId: v.string(),
  }).index("by_user", ["userId"]),
  lists: defineTable({
    title: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
    access: v.array(v.string()),
  }).index("by_user", ["userId"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
  }).index("by_token", ["subject"]),
  groups: defineTable({
    name: v.string(),
    type: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
  groupUsers: defineTable({
    userId: v.string(),
    group: v.string(),
  }),
  expenses: defineTable({
    description: v.string(),
    amount: v.number(),
    group: v.id("groups"),
    createdBy: v.string(),
    updatedBy: v.string(),
    date: v.string(),
    isSettlement: v.optional(v.boolean()),
  }),
  paidBy: defineTable({
    expense: v.id("expenses"),
    group: v.id("groups"),
    user: v.string(),
    amount: v.number(),
  }),
  splitAmong: defineTable({
    expense: v.id("expenses"),
    group: v.id("groups"),
    user: v.string(),
    amount: v.number(),
  }),
  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    sender: v.optional(v.string()),
    receiver: v.string(),
    date: v.string(),
  }),
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    user: v.string(),
    date: v.string(),
    time: v.string(),
  }),
});
