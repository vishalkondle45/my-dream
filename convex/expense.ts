import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    args.paidBy?.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("paidBy", {
        expense: expense,
        user: item.user,
        amount: item.amount,
        group: args.group,
      });
    });
    args.splitAmong?.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("splitAmong", {
        expense: expense,
        user: item.user,
        amount: item.amount,
        group: args.group,
      });
    });
    return expense;
  },
});

export const getExpenses = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let expenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return expenses;
  },
});

export const getPaidBy = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let paidBy = await ctx.db
      .query("paidBy")
      .filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return paidBy;
  },
});

export const getSplitAmong = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let splitAmong = await ctx.db
      .query("splitAmong")
      .filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return splitAmong;
  },
});
