import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    group: v.id("groups"),
    date: v.string(),
    paidBy: v.any(),
    splitAmong: v.any(),
    payer: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const expense = await ctx.db.insert("expenses", {
      description: args.description,
      date: args.date,
      amount: args?.amount,
      createdBy: identity.subject,
      group: args.group,
    });
    args.paidBy.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("paidBy", {
        expense: expense,
        user: item.user,
        amount: item.amount,
      });
    });
    args.splitAmong.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("splitAmong", {
        expense: expense,
        user: item.user,
        amount: item.amount,
      });
    });
    return expense;
  },
});
