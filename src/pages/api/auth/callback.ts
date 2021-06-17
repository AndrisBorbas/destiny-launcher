import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

import { getAccessTokensFromCode } from "@/utils/bungieApi/oauth";
import { isSecureEnvironment } from "@/utils/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			const code = req.query.code as string;
			if (!code) {
				return res.status(400).end();
			}
			const tokens = await getAccessTokensFromCode(code).catch((r: unknown) => {
				console.error(r);
				throw new Error("Can't get access token");
			});

			if (!tokens.refreshToken) {
				res.setHeader("Set-Cookie", [
					serialize("accessToken", tokens.accessToken.value, {
						maxAge: tokens.accessToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("membershipID", tokens.bungieMembershipId, {
						maxAge: tokens.accessToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("destinyLauncherLoggedIn", "1", {
						maxAge: tokens.accessToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
					}),
				]);
			} else {
				res.setHeader("Set-Cookie", [
					serialize("accessToken", tokens.accessToken.value, {
						maxAge: tokens.accessToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("refreshToken", tokens.refreshToken.value, {
						maxAge: tokens.refreshToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("membershipID", tokens.bungieMembershipId, {
						maxAge: tokens.refreshToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
						httpOnly: true,
					}),
					serialize("destinyLauncherLoggedIn", "1", {
						maxAge: tokens.refreshToken.expires,
						secure: true /* isSecureEnvironment(req) */,
						path: "/",
						sameSite: true,
					}),
				]);
			}
			return res.redirect("/");
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
