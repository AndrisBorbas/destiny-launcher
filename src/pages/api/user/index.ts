import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			return res.json("unused");
			return res.json({ user: req.cookies.accessToken });
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
