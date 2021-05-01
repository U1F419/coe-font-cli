export class CoeFontClient {
	constructor(
		private mail: string,
		private password: string,
		private option?: {},
	) {}

	login() {
		return this;
	}

	generate(content: string) {
		console.log(`content: ${content}`);
	}
}
