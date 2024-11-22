-- fuck prisma me and my homies hate prisma
create table Users (
	id varchar(64) not null,
	discord_id varchar(191) not null,
	cookie_secret varchar(191) not null,
	discord_avatar varchar(64),
	discord_name varchar(64) not null,
	constraint Users_pk primary key (id),
	constraint Users_cookie_secret_key unique (cookie_secret),
	constraint Users_discord_id_key unique (discord_id)
);
create index Users_id on Users (id);
create index Users_discord_id on Users (discord_id);
create table Saves (
	_id varchar(32) not null,
	user_id varchar(64) not null,
	general json not null default (JSON_OBJECT()),
	fishing json not null default (JSON_OBJECT()),
	cooking json not null default (JSON_OBJECT()),
	crafting json not null default (JSON_OBJECT()),
	shipping json not null default (JSON_OBJECT()),
	museum json not null default (JSON_OBJECT()),
	social json not null default (JSON_OBJECT()),
	monsters json not null default (JSON_OBJECT()),
	walnuts json not null default (JSON_OBJECT()),
	notes json not null default (JSON_OBJECT()),
	scraps json not null default (JSON_OBJECT()),
	perfection json not null default (JSON_OBJECT()),
	powers json not null default (JSON_OBJECT()),
	bundles json not null default (JSON_OBJECT()),
	constraint Saves_pk primary key (_id),
	constraint Unique_user_id_player unique (user_id, _id)
);
create index Saves_user_id on Saves (user_id);