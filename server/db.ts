import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  InsertCustomer, customers,
  InsertActivity, activities,
  InsertMetric, metrics,
  InsertEvent, events,
  InsertMessage, messages,
  InsertNotification, notifications,
  InsertTrafficData, trafficData
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER OPERATIONS =====
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "location", "jobTitle", "department", "loginMethod", "bio", "skills"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).where(eq(users.role, "user")).limit(50);
}

export async function updateUserStatus(userId: string, status: "active" | "away" | "offline") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ status }).where(eq(users.id, userId));
}

// ===== CUSTOMER OPERATIONS =====
export async function createCustomer(customer: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(customers).values(customer);
}

export async function getCustomers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customers).limit(limit).offset(offset);
}

export async function getCustomerById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCustomer(id: string, updates: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) return;
  await db.update(customers).set(updates).where(eq(customers.id, id));
}

export async function getCustomerCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`COUNT(*)` }).from(customers);
  return result[0]?.count as number || 0;
}

// ===== ACTIVITY OPERATIONS =====
export async function createActivity(activity: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(activities).values(activity);
}

export async function getRecentActivities(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
}

export async function getActivitiesByUser(userId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt)).limit(limit);
}

// ===== METRICS OPERATIONS =====
export async function createMetric(metric: InsertMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(metrics).values(metric);
}

export async function getMetricsForPeriod(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(metrics).where(
    and(
      gte(metrics.date, startDate),
      lte(metrics.date, endDate)
    )
  ).orderBy(metrics.date);
}

export async function getLatestMetrics() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(metrics).orderBy(desc(metrics.date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== EVENT OPERATIONS =====
export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(events).values(event);
}

export async function getUpcomingEvents(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events).where(gte(events.startTime, new Date())).orderBy(events.startTime).limit(limit);
}

export async function getEventsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events).where(eq(events.userId, userId)).orderBy(events.startTime);
}

// ===== MESSAGE OPERATIONS =====
export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(messages).values(message);
}

export async function getMessages(userId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages)
    .where(
      sql`(${messages.senderId} = ${userId} OR ${messages.recipientId} = ${userId})`
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function markMessageAsRead(messageId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
}

// ===== NOTIFICATION OPERATIONS =====
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}

export async function getNotifications(userId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function markNotificationAsRead(notificationId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}

// ===== TRAFFIC DATA OPERATIONS =====
export async function createTrafficData(traffic: InsertTrafficData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(trafficData).values(traffic);
}

export async function getTrafficBySource(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(trafficData)
    .where(
      and(
        gte(trafficData.date, startDate),
        lte(trafficData.date, endDate)
      )
    )
    .orderBy(trafficData.source);
}

