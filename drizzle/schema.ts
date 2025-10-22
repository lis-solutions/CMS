import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, decimal, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  department: varchar("department", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  status: mysqlEnum("status", ["active", "away", "offline"]).default("offline").notNull(),
  performance: int("performance").default(0),
  bio: text("bio"),
  skills: text("skills"), // JSON array stored as text
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  roleIdx: index("role_idx").on(table.role),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customers table for CRM
 */
export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  status: mysqlEnum("status", ["prospect", "active", "inactive"]).default("prospect").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index("customer_email_idx").on(table.email),
  statusIdx: index("customer_status_idx").on(table.status),
}));

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Activities/Tasks table
 */
export const activities = mysqlTable("activities", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  customerId: varchar("customerId", { length: 64 }),
  type: mysqlEnum("type", ["purchase", "subscription", "comment", "document", "meeting", "call"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  userIdx: index("activity_user_idx").on(table.userId),
  customerIdx: index("activity_customer_idx").on(table.customerId),
  typeIdx: index("activity_type_idx").on(table.type),
}));

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Analytics/Metrics table
 */
export const metrics = mysqlTable("metrics", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: timestamp("date").notNull(),
  totalRevenue: decimal("totalRevenue", { precision: 12, scale: 2 }).default("0"),
  newCustomers: int("newCustomers").default(0),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0"),
  avgSessionTime: int("avgSessionTime").default(0), // in seconds
  activeUsers: int("activeUsers").default(0),
  subscriptions: int("subscriptions").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  dateIdx: index("metrics_date_idx").on(table.date),
}));

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

/**
 * Calendar Events table
 */
export const events = mysqlTable("events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["meeting", "deadline", "event", "task"]).default("meeting").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  userIdx: index("event_user_idx").on(table.userId),
  startTimeIdx: index("event_start_time_idx").on(table.startTime),
}));

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Team Chat Messages table
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  senderId: varchar("senderId", { length: 64 }).notNull(),
  recipientId: varchar("recipientId", { length: 64 }),
  channelId: varchar("channelId", { length: 64 }), // For group chats
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  senderIdx: index("message_sender_idx").on(table.senderId),
  recipientIdx: index("message_recipient_idx").on(table.recipientId),
  channelIdx: index("message_channel_idx").on(table.channelId),
  createdAtIdx: index("message_created_at_idx").on(table.createdAt),
}));

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  type: mysqlEnum("type", ["message", "payment", "alert", "update"]).notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  userIdx: index("notification_user_idx").on(table.userId),
  isReadIdx: index("notification_is_read_idx").on(table.isRead),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Traffic/Analytics data table
 */
export const trafficData = mysqlTable("trafficData", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: timestamp("date").notNull(),
  source: mysqlEnum("source", ["direct", "social", "search", "referral"]).notNull(),
  visits: int("visits").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  dateIdx: index("traffic_date_idx").on(table.date),
  sourceIdx: index("traffic_source_idx").on(table.source),
}));

export type TrafficData = typeof trafficData.$inferSelect;
export type InsertTrafficData = typeof trafficData.$inferInsert;

