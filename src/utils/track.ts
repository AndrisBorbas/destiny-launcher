import { useEffect } from "react";
import * as Swetrix from "swetrix";

export const TRACKING_ID = "4Yq2ku5S2eQB";

export const useSwetrix = (
	pid: string = TRACKING_ID,
	initOptions = { apiURL: "https://succ.andrisborbas.com/log" },
	pageViewsOptions = {},
) => {
	useEffect(() => {
		Swetrix.init(pid, initOptions);
		void Swetrix.trackViews(pageViewsOptions);
	}, [initOptions, pageViewsOptions, pid]);
};
