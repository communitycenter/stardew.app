export type Role = "owner" | "editor" | "viewer";

export function canEdit(role?: Role) {
    return role === "owner" || role === "editor";
}

export function canDelete(role?: Role) {
    return role === "owner";
}

export function canInvite(role?: Role) {
    return role === "owner";
}