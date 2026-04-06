import type { NextApiRequest } from "next";

export const AUTH_COOKIE_NAMES = [
	"token",
	"uid",
	"oauth_state",
	"discord_user",
] as const;

export function isProductionHostname(hostname: string) {
	return hostname === "stardew.app" || hostname.endsWith(".stardew.app");
}

export function getHostnameFromHost(host: string) {
	if (host.startsWith("[")) {
		const bracketIndex = host.indexOf("]");
		return bracketIndex === -1 ? host : host.slice(1, bracketIndex);
	}

	return host.split(":")[0];
}

export function getCookieDomainForHostname(hostname?: string) {
	if (!hostname) return undefined;

	return isProductionHostname(hostname) ? "stardew.app" : undefined;
}

export function getRequestHost(req: NextApiRequest) {
	const forwardedHost = req.headers["x-forwarded-host"];
	const hostHeader = Array.isArray(forwardedHost)
		? forwardedHost[0]
		: (forwardedHost ?? req.headers.host);

	if (!hostHeader) return undefined;

	return hostHeader.split(",")[0]?.trim();
}

export function getRequestHostname(req: NextApiRequest) {
	const host = getRequestHost(req);
	if (!host) return undefined;

	return getHostnameFromHost(host);
}

export function getRequestProtocol(req: NextApiRequest) {
	const forwardedProto = req.headers["x-forwarded-proto"];
	const protocol = Array.isArray(forwardedProto)
		? forwardedProto[0]
		: forwardedProto;

	if (protocol) {
		return protocol.split(",")[0]?.trim();
	}

	const hostname = getRequestHostname(req);
	return hostname === "localhost" ? "http" : "https";
}

export function getRequestOrigin(req: NextApiRequest) {
	const host = getRequestHost(req);
	if (!host) return undefined;

	return `${getRequestProtocol(req)}://${host}`;
}

export function getServerCookieDomain(req: NextApiRequest) {
	return getCookieDomainForHostname(getRequestHostname(req));
}
