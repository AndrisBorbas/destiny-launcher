import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document";

class DLDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="darkreader-lock" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default DLDocument;
