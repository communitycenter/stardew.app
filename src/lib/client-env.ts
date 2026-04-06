import { deleteCookie } from "cookies-next";
import {
	AUTH_COOKIE_NAMES,
	getCookieDomainForHostname,
	isProductionHostname,
} from "@/lib/cookies";

export function isInternalHostname(hostname: string) {
	if (process.env.NEXT_PUBLIC_DEVELOPMENT === "true") {
		return true;
	}

	if (process.env.NEXT_PUBLIC_DEVELOPMENT === "false") {
		return false;
	}

	return !isProductionHostname(hostname);
}

export function getClientCookieDomain() {
	if (typeof window === "undefined") return undefined;

	return getCookieDomainForHostname(window.location.hostname);
}

export function clearClientAuthCookies() {
	const domain = getClientCookieDomain();

	for (const cookie of AUTH_COOKIE_NAMES) {
		deleteCookie(cookie, {
			maxAge: 0,
			domain,
		});
	}
}
