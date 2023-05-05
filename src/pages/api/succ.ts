import type { NextApiRequest, NextApiResponse } from "next";

import { assign } from "@/utils/track";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "POST": {
			try {
				const data = await fetch(
					"https://analytics.andrisborbas.com/api/send",
					{
						method: "POST",
						body: req.body,
						headers: assign(
							{ "Content-Type": "application/json" },
							{ "User-Agent": req.headers["user-agent"] },
						),
					},
				).then((res2) => res2.text());

				return res.status(200).json(data);
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
