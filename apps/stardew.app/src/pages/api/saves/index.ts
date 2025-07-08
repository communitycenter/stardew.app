import { db } from "$db";
import * as schema from "$drizzle/schema";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

type Data = Record<string, any>;

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
}

export async function getUID(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
): Promise<string> {
	let uid = getCookie("uid", { req, res });
	if (uid && typeof uid === "string") {
		// uids can be anonymous, so we need to check if the user exists

		const [user] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, uid))
			.limit(1);

		if (user) {
			// user exists, so we check if the user is authenticated
			// verify that the user has a stored token
			let token = getCookie("token", { req, res });
			if (!token) {
				res.status(400);
				throw new Error("User is not authenticated (1)");
			}
			// verify that the token is valid
			const { valid, userId } = verifyToken(
				token as string,
				user.cookie_secret,
			);
			if (!valid || userId !== uid) {
				res.status(400);
				throw new Error(`User is not authenticated (valid token: ${valid})`);
			}
		}
		// everything is ok, so we return the uid
		return uid as string;
	} else {
		console.log("Generating new UID...");
		// no uid, so we create an anonymous one
		uid = crypto.randomBytes(16).toString("hex");
		setCookie("uid", uid, {
			req,
			res,
			maxAge: 60 * 60 * 24 * 365,
			domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
				? "localhost"
				: "stardew.app",
		});
	}
	return uid;
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

async function get(req: NextApiRequest, res: NextApiResponse) {
	const uid = await getUID(req, res);
	const players = await db
		.select()
		.from(schema.saves)
		.where(eq(schema.saves.user_id, uid));
	res.json(players);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
	// console.log("Saving...");
	// console.log(process.env.DATABASE_URL);
	const uid = await getUID(req, res);
	const players = JSON.parse(req.body) as Player[];
	for (const player of players) {
		try {
			if (player._id) {
				await db
					.insert(schema.saves)
					.values({
						_id: player._id,
						user_id: uid,
						...player,
					})
					.onDuplicateKeyUpdate({ set: player });
			}
			res.status(200).end();
		} catch (e) {
			// console.log(e);
			res.status(500).end();
		}
	}
}

async function _delete(req: NextApiRequest, res: NextApiResponse) {
	// console.log("Deleting...");
	const uid = await getUID(req, res);

	if (!req.body) {
		// delete all players
		await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
		// const result = await conn.execute("DELETE FROM Saves WHERE user_id = ?", [
		//   uid,
		// ]);
		// console.log("[DEBUG:SAVES] DELETE | deleted all players with uid =", uid);
	} else {
		// console.log("[DEBUG:SAVES] DELETE | req.body =", req.body);
		const { type } = JSON.parse(req.body);

		if (type === "player") {
			// delete a single player
			const { _id } = JSON.parse(req.body);
			await db
				.delete(schema.saves)
				.where(and(eq(schema.saves.user_id, uid), eq(schema.saves._id, _id)));

			// const result = await conn.execute(
			//   "DELETE FROM Saves WHERE user_id = ? AND _id = ?",
			//   [uid, _id],
			// );

			// console.log("[DEBUG:SAVES] DELETE | deleted one player with id =", _id);
		} else {
			// delete entire account
			// delete players
			await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
			// const result = await conn.execute("DELETE FROM Saves WHERE user_id = ?", [
			//   uid,
			// ]);
			// delete user
			await db.delete(schema.users).where(eq(schema.users.id, uid));

			// const result2 = await conn.execute("DELETE FROM Users WHERE id = ?", [
			//   uid,
			// ]);
			// console.log("[DEBUG:SAVES] DELETE | deleted account with uid =", uid);
		}
	}
	// console.log(result.rowsAffected)
	res.status(204).end();
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
		res.send(e.message);
	}
}
