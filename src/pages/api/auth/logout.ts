import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			res.setHeader("Set-Cookie", [
				serialize("accessToken", "", {
					maxAge: -1,
					secure: true /* isSecureEnvironment(req) */,
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("refreshToken", "", {
					maxAge: -1,
					secure: true /* isSecureEnvironment(req) */,
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("membershipID", "", {
					maxAge: -1,
					secure: true /* isSecureEnvironment(req) */,
					path: "/",
					sameSite: true,
					httpOnly: true,
				}),
				serialize("destinyLauncherLoggedIn", "0", {
					maxAge: -1,
					secure: true /* isSecureEnvironment(req) */,
					path: "/",
					sameSite: true,
				}),
			]);

			return res.redirect("/");
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
