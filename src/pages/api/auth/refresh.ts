import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

import { getAccessTokenFromRefreshToken } from "@/utils/bungieApi/oauth";
import { isSecureEnvironment } from "@/utils/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			if (!req.cookies.refreshToken) {
				res.status(403).end();
				return;
			}
			const tokens = await getAccessTokenFromRefreshToken(
				req.cookies.refreshToken,
			).catch((r: unknown) => {
				console.error(r);
				throw new Error("Can't get access token");
			});
			if (!tokens.refreshToken) {
				res.status(400).end();
				return;
			}

			res.setHeader("Set-Cookie", [
				serialize("accessToken", tokens.accessToken.value, {
					maxAge: tokens.accessToken.expires,
					secure: isSecureEnvironment(req),
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("refreshToken", tokens.refreshToken.value, {
					maxAge: tokens.refreshToken.expires,
					secure: isSecureEnvironment(req),
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("membershipId", tokens.bungieMembershipId, {
					maxAge: tokens.refreshToken.expires,
					secure: isSecureEnvironment(req),
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("destinyLauncherLoggedIn", "1", {
					maxAge: tokens.refreshToken.expires,
					secure: isSecureEnvironment(req),
					path: "/",
					sameSite: true,
				}),
			]);

			res.redirect("/");
			return;
		}

		case "POST": {
			try {
				if (!req.cookies.refreshToken) {
					res.status(401).json({ error: "No refresh token available" });
					return;
				}

				const tokens = await getAccessTokenFromRefreshToken(
					req.cookies.refreshToken,
				);

				if (!tokens.refreshToken) {
					res.status(400).json({ error: "Invalid refresh token" });
					return;
				}

				res.setHeader("Set-Cookie", [
					serialize("accessToken", tokens.accessToken.value, {
						maxAge: tokens.accessToken.expires,
						secure: isSecureEnvironment(req),
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("refreshToken", tokens.refreshToken.value, {
						maxAge: tokens.refreshToken.expires,
						secure: isSecureEnvironment(req),
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("membershipId", tokens.bungieMembershipId, {
						maxAge: tokens.refreshToken.expires,
						secure: isSecureEnvironment(req),
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("destinyLauncherLoggedIn", "1", {
						maxAge: tokens.refreshToken.expires,
						secure: isSecureEnvironment(req),
						path: "/",
						sameSite: true,
					}),
				]);

				res.status(200).json({ success: true });
				return;
			} catch (error: unknown) {
				console.error("Token refresh failed:", error);
				res.status(401).json({
					error: "Token refresh failed",
					details: error instanceof Error ? error.message : String(error),
				});
				return;
			}
		}

		default: {
			res.setHeader("Allow", "GET, POST");
			res.status(405).end();
			return;
		}
	}
};
