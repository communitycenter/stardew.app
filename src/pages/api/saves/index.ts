import type { Db } from "$db";
import { withDb } from "$db";
import * as schema from "$drizzle/schema";
import { getServerCookieDomain } from "@/lib/cookies";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

type Data = Record<string, any>;

function parseRequestBody<T>(body: unknown): T {
	if (typeof body === "string") {
		if (!body) {
			return {} as T;
		}

		return JSON.parse(body) as T;
	}

	return (body ?? {}) as T;
}

export interface SqlUser {
	id: string;
	discord_id: string;
	cookie_secret: string;
	discord_avatar: string;
	discord_name: string;
}

export interface Player {
	_id?: string;
	general?: object;
	bundles?: Array<object>;
	fishing?: object;
	cooking?: object;
	crafting?: object;
	shipping?: object;
	museum?: object;
	social?: object;
	monsters?: object;
	walnuts: object;
	notes?: object;
	scraps?: object;
	perfection?: object;
	powers?: object;
	rarecrows?: object;
	animals?: object;
}

export const saveFields = [
	"general",
	"bundles",
	"fishing",
	"cooking",
	"crafting",
	"shipping",
	"museum",
	"social",
	"monsters",
	"walnuts",
	"notes",
	"scraps",
	"perfection",
	"powers",
	"rarecrows",
	"animals",
] as const satisfies ReadonlyArray<keyof Player>;

export type SaveField = (typeof saveFields)[number];

// Columns returned to the client. updated_at is internal bookkeeping.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { updated_at: _updatedAt, ...saveColumns } = getTableColumns(
	schema.saves,
);

function pickSaveFields(player: Player) {
	const picked: Partial<Record<SaveField, unknown>> = {};
	for (const field of saveFields) {
		if (Object.prototype.hasOwnProperty.call(player, field)) {
			picked[field] = player[field];
		}
	}
	return picked;
}

export type Session = {
	uid: string;
	/** The signed-in user, when the request carries a valid token. */
	user?: typeof schema.users.$inferSelect;
};

export async function getSession(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	db: Db,
): Promise<Session> {
	let uid = getCookie("uid", { req, res });
	if (uid && typeof uid === "string") {
		// Only authenticated users (those with a token cookie) need a DB lookup.
		// Anonymous users will never be in the users table, so skip the query.
		const token = getCookie("token", { req, res });
		if (token) {
			const [user] = await db
				.select()
				.from(schema.users)
				.where(eq(schema.users.id, uid))
				.limit(1);

			if (user) {
				const { valid, userId } = verifyToken(
					token as string,
					user.cookie_secret,
				);
				if (!valid || userId !== uid) {
					res.status(400);
					throw new Error(`User is not authenticated (valid token: ${valid})`);
				}
				return { uid, user };
			}
		}
		return { uid };
	} else {
		console.log("Generating new UID...");
		uid = crypto.randomBytes(16).toString("hex");
		setCookie("uid", uid, {
			req,
			res,
			maxAge: 60 * 60 * 24 * 365,
			domain: getServerCookieDomain(req),
		});
	}
	return { uid };
}

export async function getUID(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	db: Db,
): Promise<string> {
	return (await getSession(req, res, db)).uid;
}

// magic functions dreamt up by me, i think they're secure lol, i use them a lot - Leah
export const createToken = (userId: string, key: string, validFor: number) => {
	const expires = Math.floor(new Date().getTime() / 1000 + validFor);
	const salt = crypto.randomBytes(8).toString("hex");
	const payload = Buffer.from(`${expires}.${userId}.${salt}`, "utf8").toString(
		"base64",
	);
	const signature = crypto
		.createHmac("sha256", key)
		.update(payload)
		.digest("hex");
	return { token: `${payload}.${signature}`, expires };
};

export const verifyToken = (token: string, key: string) => {
	const [payload, signature] = token.split(".");
	const decoded = Buffer.from(payload, "base64").toString("utf8");
	const [expires, userId] = decoded.split(".");
	const expectedSignature = crypto
		.createHmac("sha256", key)
		.update(payload)
		.digest("hex");
	return {
		valid:
			signature === expectedSignature &&
			parseInt(expires) > Math.floor(new Date().getTime() / 1000),
		userId,
	};
};

async function getPlayersByUid(db: Db, uid: string) {
	return db
		.select(saveColumns)
		.from(schema.saves)
		.where(eq(schema.saves.user_id, uid));
}

async function get(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);

		const uid = await getUID(req, res, db);
		const players = await getPlayersByUid(db, uid);

		res.json(players);
	});
}

async function post(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);

		const uid = await getUID(req, res, db);
		const players = parseRequestBody<Player[]>(req.body);

		try {
			for (const player of players) {
				if (!player._id) continue;

				// Only known save columns, so a client can't write updated_at
				// (or anything else) directly.
				const fields = pickSaveFields(player);
				await db
					.insert(schema.saves)
					.values({
						...fields,
						_id: player._id,
						user_id: uid,
						updated_at: sql`CURRENT_TIMESTAMP`,
					})
					.onDuplicateKeyUpdate({
						// Bump even when the data is unchanged: an upload means the
						// save is still in use.
						set: { ...fields, updated_at: sql`CURRENT_TIMESTAMP` },
					});
			}

			const savedPlayers = await getPlayersByUid(db, uid);
			res.status(200).json(savedPlayers);
		} catch (e) {
			console.log(e);
			res.status(500).end();
		}
	});
}

async function _delete(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		const uid = await getUID(req, res, db);
		const body = req.body
			? parseRequestBody<{ type?: string; _id?: string }>(req.body)
			: undefined;
		const type = body?.type;

		if (type === "player") {
			const playerId = body?._id;
			if (!playerId) {
				return res.status(400).end();
			}

			await db
				.delete(schema.saves)
				.where(
					and(eq(schema.saves.user_id, uid), eq(schema.saves._id, playerId)),
				);
		} else if (type === "account") {
			await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
			await db.delete(schema.users).where(eq(schema.users.id, uid));

			res.setHeader(
				"Cache-Control",
				"no-store, no-cache, must-revalidate, max-age=0",
			);
			return res.status(204).end();
		} else {
			await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
		}

		const remainingPlayers = await getPlayersByUid(db, uid);
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);
		res.status(200).json(remainingPlayers);
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		switch (req.method) {
			case "GET":
				return await get(req, res);
			case "POST":
				return await post(req, res);
			case "DELETE":
				return await _delete(req, res);
		}
		res.status(405).end();
	} catch (e: any) {
		console.error(e);
		const status = res.statusCode >= 400 ? res.statusCode : 500;
		res
			.status(status)
			.send(e instanceof Error ? e.message : "Internal Server Error");
	}
}
