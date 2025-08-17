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
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						body: req.body,
						// @ts-expect-error: works for now
						headers: assign(
							{ "Content-Type": "application/json" },
							{ "User-Agent": req.headers["user-agent"] },
						),
					},
				).then((res2) => res2.text());

				res.status(200).json(data);
				return;
			} catch (error) {
				console.error(error);
				res.status(401).end();
				return;
			}
		}

		default: {
			res.setHeader("Allow", "POST");
			res.status(405).end();
			return;
		}
	}
};
