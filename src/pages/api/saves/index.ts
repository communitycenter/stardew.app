import type { Db } from "$db";
import { withDb } from "$db";
import * as schema from "$drizzle/schema";
import { getServerCookieDomain } from "@/lib/cookies";
import { getCookie, setCookie } from "cookies-next";
import { and, eq } from "drizzle-orm";
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

function randomHex(byteCount: number): string {
	const bytes = new Uint8Array(byteCount);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function hmacSign(key: string, data: string): Promise<string> {
	const encoder = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		encoder.encode(key),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		cryptoKey,
		encoder.encode(data),
	);
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function hmacVerify(
	key: string,
	data: string,
	signature: string,
): Promise<boolean> {
	const expected = await hmacSign(key, data);
	return expected === signature;
}

export interface AuthResult {
	uid: string;
	user?: SqlUser;
}

export async function getUID(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	db: Db,
): Promise<AuthResult> {
	let uid = getCookie("uid", { req, res });
	if (uid && typeof uid === "string") {
		// Check if user has a token cookie - if not, they're anonymous
		const token = getCookie("token", { req, res });
		if (!token) {
			return { uid };
		}

		// User has a token, so verify it against the DB
		const [user] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, uid))
			.limit(1);

		if (user) {
			const { valid, userId } = await verifyToken(
				token as string,
				user.cookie_secret,
			);
			if (!valid || userId !== uid) {
				res.status(400);
				throw new Error(
					`User is not authenticated (valid token: ${valid})`,
				);
			}
			return { uid, user: user as SqlUser };
		}

		// uid cookie exists but user not in DB - treat as anonymous
		return { uid };
	} else {
		// no uid, so we create an anonymous one
		uid = randomHex(16);
		setCookie("uid", uid, {
			req,
			res,
			maxAge: 60 * 60 * 24 * 365,
			domain: getServerCookieDomain(req),
		});
	}
	return { uid };
}

export const createToken = async (
	userId: string,
	key: string,
	validFor: number,
) => {
	const expires = Math.floor(new Date().getTime() / 1000 + validFor);
	const salt = randomHex(8);
	const payload = btoa(`${expires}.${userId}.${salt}`);
	const signature = await hmacSign(key, payload);
	return { token: `${payload}.${signature}`, expires };
};

export const verifyToken = async (token: string, key: string) => {
	const [payload, signature] = token.split(".");
	const decoded = atob(payload);
	const [expires, userId] = decoded.split(".");
	const valid = await hmacVerify(key, payload, signature);
	return {
		valid:
			valid &&
			parseInt(expires) > Math.floor(new Date().getTime() / 1000),
		userId,
	};
};

async function getPlayersByUid(db: Db, uid: string) {
	return db.select().from(schema.saves).where(eq(schema.saves.user_id, uid));
}

async function get(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);

		const { uid } = await getUID(req, res, db);
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

		const { uid } = await getUID(req, res, db);
		const players = parseRequestBody<Player[]>(req.body);

		try {
			const validPlayers = players.filter((p) => p._id);
			if (validPlayers.length > 0) {
				await Promise.all(
					validPlayers.map((player) =>
						db
							.insert(schema.saves)
							.values({
								_id: player._id!,
								user_id: uid,
								...player,
							})
							.onDuplicateKeyUpdate({
								set: {
									user_id: uid,
									...player,
								},
							}),
					),
				);
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
		const { uid } = await getUID(req, res, db);
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
					and(
						eq(schema.saves.user_id, uid),
						eq(schema.saves._id, playerId),
					),
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
