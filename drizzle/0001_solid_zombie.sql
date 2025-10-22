CREATE TABLE `activities` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`customerId` varchar(64),
	`type` enum('purchase','subscription','comment','document','meeting','call') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`status` enum('prospect','active','inactive') NOT NULL DEFAULT 'prospect',
	`value` decimal(10,2) DEFAULT '0',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('meeting','deadline','event','task') NOT NULL DEFAULT 'meeting',
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`location` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`recipientId` varchar(64),
	`channelId` varchar(64),
	`content` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` varchar(64) NOT NULL,
	`date` timestamp NOT NULL,
	`totalRevenue` decimal(12,2) DEFAULT '0',
	`newCustomers` int DEFAULT 0,
	`conversionRate` decimal(5,2) DEFAULT '0',
	`avgSessionTime` int DEFAULT 0,
	`activeUsers` int DEFAULT 0,
	`subscriptions` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`type` enum('message','payment','alert','update') NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trafficData` (
	`id` varchar(64) NOT NULL,
	`date` timestamp NOT NULL,
	`source` enum('direct','social','search','referral') NOT NULL,
	`visits` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `trafficData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `jobTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('active','away','offline') DEFAULT 'offline' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `performance` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `skills` text;--> statement-breakpoint
CREATE INDEX `activity_user_idx` ON `activities` (`userId`);--> statement-breakpoint
CREATE INDEX `activity_customer_idx` ON `activities` (`customerId`);--> statement-breakpoint
CREATE INDEX `activity_type_idx` ON `activities` (`type`);--> statement-breakpoint
CREATE INDEX `customer_email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `customer_status_idx` ON `customers` (`status`);--> statement-breakpoint
CREATE INDEX `event_user_idx` ON `events` (`userId`);--> statement-breakpoint
CREATE INDEX `event_start_time_idx` ON `events` (`startTime`);--> statement-breakpoint
CREATE INDEX `message_sender_idx` ON `messages` (`senderId`);--> statement-breakpoint
CREATE INDEX `message_recipient_idx` ON `messages` (`recipientId`);--> statement-breakpoint
CREATE INDEX `message_channel_idx` ON `messages` (`channelId`);--> statement-breakpoint
CREATE INDEX `message_created_at_idx` ON `messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `metrics_date_idx` ON `metrics` (`date`);--> statement-breakpoint
CREATE INDEX `notification_user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notification_is_read_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `traffic_date_idx` ON `trafficData` (`date`);--> statement-breakpoint
CREATE INDEX `traffic_source_idx` ON `trafficData` (`source`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);