CREATE TABLE `configurations` (
	`guild` varchar(20) NOT NULL,
	`updateTime` int NOT NULL DEFAULT 10,
	`adminRole` varchar(20),
	CONSTRAINT `configurations_guild` PRIMARY KEY(`guild`)
);
--> statement-breakpoint
CREATE TABLE `points` (
	`guild` varchar(20) NOT NULL,
	`user` varchar(20) NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	CONSTRAINT `points_guild` PRIMARY KEY(`guild`)
);
