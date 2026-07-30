import type { Db } from "$db";
import * as schema from "$drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getPermission(
    db: Db,
    userId: string,
    saveId: string,
) {
    const [permission] = await db
        .select()
        .from(schema.ownership)
        .where(
            and(
                eq(schema.ownership.userId, userId),
                eq(schema.ownership.saveId, saveId),
            ),
        )
        .limit(1);

    return permission;
}

export async function canView(
    db: Db,
    userId: string,
    saveId: string,
) {
    return (await getPermission(db, userId, saveId)) !== null;
}

export async function canEdit(
    db: Db,
    userId: string,
    saveId: string,
) {
    const permission = await getPermission(db, userId, saveId);

    return (
        permission &&
        (permission.role === "owner" ||
            permission.role === "editor")
    );
}

export async function isOwner(
    db: Db,
    userId: string,
    saveId: string,
) {
    const permission = await getPermission(db, userId, saveId);

    return permission?.role === "owner";
}