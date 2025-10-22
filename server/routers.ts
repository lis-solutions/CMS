import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getTeamMembers, 
  getRecentActivities,
  getLatestMetrics,
  getUpcomingEvents,
  getMessages,
  getNotifications,
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerCount,
  createActivity,
  getActivitiesByUser,
  getMetricsForPeriod,
  createEvent,
  getEventsByUser,
  createMessage,
  markMessageAsRead,
  createNotification,
  markNotificationAsRead,
  getTrafficBySource,
  updateUserStatus,
  getUser
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== DASHBOARD =====
  dashboard: router({
    getOverview: protectedProcedure.query(async () => {
      const metrics = await getLatestMetrics();
      const recentActivities = await getRecentActivities(5);
      const upcomingEvents = await getUpcomingEvents(5);
      const teamMembers = await getTeamMembers();
      const customerCount = await getCustomerCount();

      return {
        metrics: metrics || {
          totalRevenue: 45231.89,
          newCustomers: 1234,
          conversionRate: 4.2,
          activeUsers: 573,
          subscriptions: 12234,
          systemUptime: 92.5,
        },
        recentActivities,
        upcomingEvents,
        teamMembers: teamMembers.slice(0, 4),
        customerCount,
      };
    }),

    getPerformanceTrends: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - input.days * 24 * 60 * 60 * 1000);
        return await getMetricsForPeriod(startDate, endDate);
      }),
  }),

  // ===== CUSTOMERS =====
  customers: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getCustomers(input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getCustomerById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createCustomer({
          id,
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          notes: input.notes,
          status: "prospect",
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        status: z.enum(["prospect", "active", "inactive"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateCustomer(id, updates);
        return { success: true };
      }),
  }),

  // ===== ACTIVITIES =====
  activities: router({
    list: protectedProcedure
      .input(z.object({ userId: z.string().optional(), limit: z.number().default(20) }))
      .query(async ({ input, ctx }) => {
        if (input.userId) {
          return await getActivitiesByUser(input.userId, input.limit);
        }
        return await getRecentActivities(input.limit);
      }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["purchase", "subscription", "comment", "document", "meeting", "call"]),
        title: z.string(),
        description: z.string().optional(),
        customerId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createActivity({
          id,
          userId: ctx.user.id,
          type: input.type,
          title: input.title,
          description: input.description,
          customerId: input.customerId,
        });
        return { id };
      }),
  }),

  // ===== ANALYTICS =====
  analytics: router({
    getMetrics: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - input.days * 24 * 60 * 60 * 1000);
        return await getMetricsForPeriod(startDate, endDate);
      }),

    getTrafficSources: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - input.days * 24 * 60 * 60 * 1000);
        return await getTrafficBySource(startDate, endDate);
      }),
  }),

  // ===== CALENDAR =====
  calendar: router({
    getUpcoming: protectedProcedure.query(async () => {
      return await getUpcomingEvents(20);
    }),

    getUserEvents: protectedProcedure.query(async ({ ctx }) => {
      return await getEventsByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.enum(["meeting", "deadline", "event", "task"]),
        startTime: z.date(),
        endTime: z.date().optional(),
        location: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createEvent({
          id,
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          type: input.type,
          startTime: input.startTime,
          endTime: input.endTime,
          location: input.location,
        });
        return { id };
      }),
  }),

  // ===== TEAM CHAT =====
  chat: router({
    getMessages: protectedProcedure.query(async ({ ctx }) => {
      return await getMessages(ctx.user.id, 50);
    }),

    send: protectedProcedure
      .input(z.object({
        content: z.string(),
        recipientId: z.string().optional(),
        channelId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createMessage({
          id,
          senderId: ctx.user.id,
          content: input.content,
          recipientId: input.recipientId,
          channelId: input.channelId,
        });
        return { id };
      }),

    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.string() }))
      .mutation(async ({ input }) => {
        await markMessageAsRead(input.messageId);
        return { success: true };
      }),
  }),

  // ===== NOTIFICATIONS =====
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getNotifications(ctx.user.id, 20);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string().optional(),
        type: z.enum(["message", "payment", "alert", "update"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createNotification({
          id,
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          type: input.type,
        });
        return { id };
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),

  // ===== TEAM =====
  team: router({
    getMembers: protectedProcedure.query(async () => {
      return await getTeamMembers();
    }),

    updateStatus: protectedProcedure
      .input(z.object({ status: z.enum(["active", "away", "offline"]) }))
      .mutation(async ({ input, ctx }) => {
        await updateUserStatus(ctx.user.id, input.status);
        return { success: true };
      }),

    getProfile: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await getUser(input.userId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

