import { MDXProvider } from "@mdx-js/react";

import FAQContent from "@/data/FAQ.mdx";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./FAQ.module.css";

const components = {
	// eslint-disable-next-line jsx-a11y/heading-has-content
	h3: ({ ...restProps }) => <h3 className={styles.question} {...restProps} />,
	p: ({ ...restProps }) => <p className={styles.answer} {...restProps} />,

	a: ({ ...restProps }) => (
		// @ts-expect-error: mdx should have href
		<TrackingLink
			className={styles.link}
			rel="noopener"
			target="_blank"
			isExternal
			eventName="faq-link-click"
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			eventData={{ site: restProps.href }}
			{...restProps}
		/>
	),
	ul: ({ ...restProps }) => <ul className="list-disc pl-8" {...restProps} />,
};

export function FAQ() {
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
