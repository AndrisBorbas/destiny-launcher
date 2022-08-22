import { MDXProvider } from "@mdx-js/react";

import FAQContent from "@/data/FAQ.mdx";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./FAQ.module.scss";

/* eslint-disable react/display-name */

const components = {
	// eslint-disable-next-line jsx-a11y/heading-has-content
	h3: ({ ...restProps }) => <h3 className={styles.question} {...restProps} />,
	p: ({ ...restProps }) => <p className={styles.answer} {...restProps} />,

	a: ({ ...restProps }) => (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		// @ts-expect-error: Should have link from mdx
		<TrackingLink
			className={styles.link}
			rel="noopener"
			target="_blank"
			isExternal
			eventName="faq-link-click"
			{...restProps}
		/>
	),
	ul: ({ ...restProps }) => <ul className="list-disc pl-8" {...restProps} />,
};

/* eslint-enable react/display-name */

export default function FAQ() {
	return (
		<>
			<h2 className={styles.headerText}>Frequently Asked Questions</h2>
			<section id="FAQ" className={styles.faq}>
				<MDXProvider components={components}>
					<FAQContent />
				</MDXProvider>
			</section>
		</>
	);
}
