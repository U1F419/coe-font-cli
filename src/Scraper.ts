import puppeteer from "puppeteer";

const URL = "https://coefont.studio/" as const;

export class Scraper {
	constructor(
		private browser: puppeteer.Browser,
		private page: puppeteer.Page,
	) {}

	static async build() {
		const browser = await puppeteer.launch({
			headless: false,
			devtools: true,
		});
		const page = await browser.newPage();
		return new Scraper(browser, page);
	}

	async login(mail: string, password: string) {
		await this.page.goto(URL + "login", { waitUntil: "networkidle2" });
		await this.screenshot("login");

		await this.page.type(
			"form.v-form > div:nth-child(1) > div input",
			mail,
		);
		await this.page.type(
			"form.v-form > div:nth-child(2) > div input",
			password,
		);

		await this.screenshot("input");

		await this.page.click("form.v-form > button");

		if (await this.page.$(".v-alert")) {
			throw new Error("mail or password is invalid");
		}

		await this.page.waitForNavigation({ waitUntil: "networkidle2" });
		await this.screenshot("after_login");
	}

	async close() {
		await this.browser.close();
	}

	async screenshot(name: string) {
		await this.page.screenshot({ path: `screenshot/${name}.png` });
	}
}
