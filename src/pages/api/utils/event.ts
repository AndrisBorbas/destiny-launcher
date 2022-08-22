import type { NextApiRequest, NextApiResponse } from "next";

import { assign, TRACKING_ID } from "@/utils/track";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "POST": {
			try {
				const data = await fetch(
					"https://analytics.andrisborbas.com/api/collect",
					{
						method: "POST",
						body: req.body,
						headers: { "Content-Type": "application/json" },
					},
				).then((res2) => res2.json());

				return res.status(200).json(data);

				return res.json("unused");
				return res.json({ user: req.cookies.accessToken });
			} catch (error) {
				console.error(error);
				return res.status(401).end();
			}
		}

		default: {
			res.setHeader("Allow", "POST");
			return res.status(405).end();
		}
	}
};
