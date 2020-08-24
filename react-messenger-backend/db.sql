CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists users (
	id uuid default uuid_generate_v4 (),
	name varchar(100) not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	constraint users_id_pk primary key (id)
);

create table if not exists groups (
	id uuid default uuid_generate_v4 (),
	name varchar(100),
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	constraint groups_id_pk primary key (id)
);

create table if not exists groups_users (
	group_id uuid not null,
	user_id uuid not null,
	is_deleted bool default false,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	primary key (group_id, user_id),
	constraint groups_users_group_id_fk foreign key (group_id) references groups(id),
	constraint groups_users_user_id_fk foreign key (user_id) references users(id)
);

create table if not exists message (
	id uuid DEFAULT uuid_generate_v4 (),
	sender_id uuid not null,
	group_id uuid not null,
	contents text,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	constraint message_id_pk primary key (id), 
	constraint message_sender_id_fk foreign key (sender_id) references users(id),
	constraint message_groupd_id_fk foreign key (group_id) references groups(id)
);

