import { Scraper } from "./Scraper";

export class CoeFontClient {
	private static DEFAULT_DOWNLOAD_PATH = "./download";

	private constructor(private scraper: Scraper, private option: {}) {}

	static async build(
		downloadPath: string = this.DEFAULT_DOWNLOAD_PATH,
		option = {},
	) {
		const scraper = await Scraper.build(downloadPath);
		return new CoeFontClient(scraper, option);
	}

	async login(email: string, password: string) {
		await this.scraper.login(email, password);
		return this;
	}

	async generate(content: string) {
		await this.scraper.generate(content);
	}

	async exit() {
		await this.scraper.close();
	}
}
